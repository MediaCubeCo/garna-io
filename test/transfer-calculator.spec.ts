import { describe, expect, it } from 'vitest';
import routeData from '../src/data/corpay-routes.json';
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
