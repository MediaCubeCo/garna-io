import { describe, expect, it } from 'vitest';
import routeData from '../src/data/corpay-routes.json';
import { createTransferRateHandler } from '../src/routes/rates';
import { calculateTransfer, getClientFxMarginRate } from '../src/utils/transfer-calculator';
import { extractRevolutRate, RevolutRateProvider } from '../src/utils/revolut-rate-provider';

describe('Business Account transfer calculator', () => {
	it('applies the approved Poland USD to PLN pricing formula', () => {
		const result = calculateTransfer({
			amount: 1000,
			sourceCurrency: 'USD',
			destinationCurrency: 'PLN',
			providerFixedFeeUsd: 3,
			usdToSourceRate: 1,
			sourceToDestinationRate: 3.7275,
		});

		expect(result.transferFee).toBe(3.9);
		expect(result.clientRate).toBeCloseTo(3.65295, 10);
		expect(result.recipientGets).toBe(3638.7);
	});

	it('uses no margin for the same currency and 1.5% only for EUR destinations', () => {
		expect(getClientFxMarginRate('USD', 'USD')).toBe(0);
		expect(getClientFxMarginRate('USD', 'EUR')).toBe(0.015);
		expect(getClientFxMarginRate('EUR', 'GBP')).toBe(0.02);
	});

	it('never produces a negative recipient amount when the fee is too high', () => {
		const result = calculateTransfer({
			amount: 3,
			sourceCurrency: 'USD',
			destinationCurrency: 'PLN',
			providerFixedFeeUsd: 3,
			usdToSourceRate: 1,
			sourceToDestinationRate: 3.7,
		});
		expect(result.isPayable).toBe(false);
		expect(result.recipientGets).toBe(0);
	});

	it('contains only the normalized CA Corpay route snapshot', () => {
		expect(routeData.meta.legalEntity).toBe('CA');
		expect(routeData.meta.provider).toBe('Corpay');
		expect(routeData.routes).toHaveLength(365);
		expect(routeData.routes.every((route) => Number.isFinite(route.providerFixedFeeUsd))).toBe(true);
		expect(routeData.routes.every((route) => !route.source.sheet.includes('Adult'))).toBe(true);
		const poland = routeData.routes.find((route) => route.country === 'Poland' && route.currencyCode === 'PLN');
		expect(poland?.providerFixedFeeUsd).toBe(3);
	});
});

describe('Revolut rate provider', () => {
	it('extracts rates from supported response envelopes', () => {
		expect(extractRevolutRate({ rate: 3.7 })).toBe(3.7);
		expect(extractRevolutRate({ data: { exchangeRate: '0.86' } })).toBe(0.86);
	});

	it('uses a direct pair when it is available', async () => {
		const fetcher: typeof fetch = async () => new Response(JSON.stringify({ rate: 3.7 }), { headers: { 'content-type': 'application/json' } });
		const quote = await new RevolutRateProvider(fetcher).getRate('USD', 'PLN');
		expect(quote.rate).toBe(3.7);
		expect(quote.provider).toBe('Revolut public quote');
	});

	it('falls back to a cross rate through USD when the direct pair fails', async () => {
		const fetcher: typeof fetch = async (input) => {
			const url = String(input);
			if (url.endsWith('EURPLN')) return new Response('not found', { status: 404 });
			if (url.endsWith('USDEUR')) return new Response(JSON.stringify({ rate: 0.8 }), { headers: { 'content-type': 'application/json' } });
			if (url.endsWith('USDPLN')) return new Response(JSON.stringify({ rate: 4 }), { headers: { 'content-type': 'application/json' } });
			return new Response('not found', { status: 404 });
		};
		const quote = await new RevolutRateProvider(fetcher).getRate('EUR', 'PLN');
		expect(quote.rate).toBe(5);
		expect(quote.provider).toContain('cross via USD');
	});
});

describe('Transfer rate endpoint cache', () => {
	it('caches a successful quote for one hour and serves it as the fallback after an outage', async () => {
		let currentTime = 0;
		let calls = 0;
		const provider = {
			getRate: async () => {
				calls += 1;
				if (calls > 1) throw new Error('Revolut quote service returned 502');
				return { from: 'USD', to: 'PLN', rate: 3.7, asOf: '2026-10-22T10:00:00.000Z', provider: 'Revolut public quote' };
			},
		};
		const handler = createTransferRateHandler({ provider, now: () => currentTime, edgeCache: null });
		const request = () => new Request('https://garna.io/api/rates?from=USD&to=PLN');

		const initial = await handler(request());
		expect(initial?.status).toBe(200);
		expect(initial?.headers.get('X-Rate-Cache')).toBe('miss');
		expect(calls).toBe(1);

		currentTime = 59 * 60 * 1000;
		const fresh = await handler(request());
		expect(fresh?.headers.get('X-Rate-Cache')).toBe('hit');
		expect(calls).toBe(1);

		currentTime = 61 * 60 * 1000;
		const fallback = await handler(request());
		expect(fallback?.status).toBe(200);
		expect(fallback?.headers.get('X-Rate-Cache')).toBe('stale');
		expect(await fallback?.json()).toMatchObject({ rate: 3.7, isFallback: true });
		expect(calls).toBe(2);
	});

	it('still returns 502 when Revolut fails before any rate has been cached', async () => {
		const handler = createTransferRateHandler({
			provider: { getRate: async () => { throw new Error('Revolut quote service returned 502'); } },
			edgeCache: null,
		});
		const response = await handler(new Request('https://garna.io/api/rates?from=USD&to=PLN'));
		expect(response?.status).toBe(502);
	});

	it('keeps the last successful quote in the shared edge cache for a new Worker isolate', async () => {
		const responses = new Map<string, Response>();
		const edgeCache = {
			match: async (request: Request) => responses.get(request.url)?.clone(),
			put: async (request: Request, response: Response) => { responses.set(request.url, response.clone()); },
		} as unknown as Cache;
		const request = () => new Request('https://garna.io/api/rates?from=USD&to=PLN');
		const successfulHandler = createTransferRateHandler({
			provider: { getRate: async () => ({ from: 'USD', to: 'PLN', rate: 3.7, asOf: '2026-10-22T10:00:00.000Z', provider: 'Revolut public quote' }) },
			edgeCache,
		});
		await successfulHandler(request());
		for (const key of responses.keys()) if (key.includes('/fresh/')) responses.delete(key);

		const restartedHandler = createTransferRateHandler({
			provider: { getRate: async () => { throw new Error('Revolut quote service returned 502'); } },
			edgeCache,
		});
		const fallback = await restartedHandler(request());
		expect(fallback?.status).toBe(200);
		expect(fallback?.headers.get('X-Rate-Cache')).toBe('stale');
		expect(await fallback?.json()).toMatchObject({ rate: 3.7, isFallback: true });
	});
});
