import { RevolutRateProvider, type RateQuote } from '../utils/revolut-rate-provider';

const provider = new RevolutRateProvider();
const memoryCache = new Map<string, { expiresAt: number; quote: RateQuote }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': status === 200 ? 'public, max-age=300, s-maxage=900' : 'no-store',
		},
	});

export async function handleTransferRate(request: Request): Promise<Response | null> {
	const url = new URL(request.url);
	if (url.pathname !== '/api/rates') return null;
	if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);

	const from = (url.searchParams.get('from') || '').toUpperCase();
	const to = (url.searchParams.get('to') || '').toUpperCase();
	const key = `${from}:${to}`;
	const cached = memoryCache.get(key);
	if (cached && cached.expiresAt > Date.now()) return json(cached.quote);

	try {
		const quote = await provider.getRate(from, to);
		if (!Number.isFinite(quote.rate) || quote.rate <= 0) throw new Error('Exchange rate unavailable');
		memoryCache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, quote });
		return json(quote);
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Exchange rate unavailable' },
			502,
		);
	}
}
