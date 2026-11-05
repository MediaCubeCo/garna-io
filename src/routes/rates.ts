import { RevolutRateProvider, type RateQuote } from '../utils/revolut-rate-provider';

const FRESH_CACHE_TTL_MS = 60 * 60 * 1000;
const LAST_RATE_TTL_SECONDS = 30 * 24 * 60 * 60;
const CACHE_PATH = '/__garna-rate-cache';

type CachedQuote = { freshUntil: number; quote: RateQuote };
type RateProvider = Pick<RevolutRateProvider, 'getRate'>;
type TransferRateHandlerOptions = {
	provider?: RateProvider;
	now?: () => number;
	edgeCache?: Cache | null;
};

export type TransferRateQuote = RateQuote & {
	isFallback?: boolean;
};

const json = (body: unknown, status = 200, cacheStatus?: 'hit' | 'miss' | 'stale') =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': status === 200
				? 'public, max-age=3600, s-maxage=3600, stale-if-error=86400'
				: 'no-store',
			...(cacheStatus ? { 'X-Rate-Cache': cacheStatus } : {}),
		},
	});

const cacheRequest = (origin: string, kind: 'fresh' | 'last', from: string, to: string) =>
	new Request(`${origin}${CACHE_PATH}/${kind}/${from}/${to}`);

const readCachedQuote = async (cache: Cache | null, origin: string, kind: 'fresh' | 'last', from: string, to: string) => {
	if (!cache) return null;
	try {
		const response = await cache.match(cacheRequest(origin, kind, from, to));
		if (!response) return null;
		const quote = await response.json() as RateQuote;
		return Number.isFinite(quote.rate) && quote.rate > 0 ? quote : null;
	} catch {
		return null;
	}
};

const writeCachedQuote = async (cache: Cache | null, origin: string, kind: 'fresh' | 'last', quote: RateQuote) => {
	if (!cache) return;
	const maxAge = kind === 'fresh' ? FRESH_CACHE_TTL_MS / 1000 : LAST_RATE_TTL_SECONDS;
	try {
		await cache.put(
			cacheRequest(origin, kind, quote.from, quote.to),
			new Response(JSON.stringify(quote), {
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'Cache-Control': `public, max-age=${maxAge}`,
				},
			}),
		);
	} catch {
		// The in-memory cache still protects the active Worker isolate.
	}
};

const defaultEdgeCache = () => {
	try {
		return typeof caches === 'undefined'
			? null
			: (caches as CacheStorage & { default?: Cache }).default ?? null;
	} catch {
		return null;
	}
};

export function createTransferRateHandler(options: TransferRateHandlerOptions = {}) {
	const provider = options.provider ?? new RevolutRateProvider();
	const now = options.now ?? Date.now;
	const memoryCache = new Map<string, CachedQuote>();

	return async function handleTransferRate(request: Request): Promise<Response | null> {
		const url = new URL(request.url);
		if (url.pathname !== '/api/rates') return null;
		if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);

		const from = (url.searchParams.get('from') || '').toUpperCase();
		const to = (url.searchParams.get('to') || '').toUpperCase();
		const key = `${from}:${to}`;
		const cacheOrigin = url.origin;
		const edgeCache = options.edgeCache === undefined ? defaultEdgeCache() : options.edgeCache;
		const cached = memoryCache.get(key);
		if (cached && cached.freshUntil > now()) return json(cached.quote, 200, 'hit');

		const edgeQuote = await readCachedQuote(edgeCache, cacheOrigin, 'fresh', from, to);
		if (edgeQuote) {
			memoryCache.set(key, { freshUntil: now() + FRESH_CACHE_TTL_MS, quote: edgeQuote });
			return json(edgeQuote, 200, 'hit');
		}

		try {
			const quote = await provider.getRate(from, to);
			if (!Number.isFinite(quote.rate) || quote.rate <= 0) throw new Error('Exchange rate unavailable');
			memoryCache.set(key, { freshUntil: now() + FRESH_CACHE_TTL_MS, quote });
			await Promise.all([
				writeCachedQuote(edgeCache, cacheOrigin, 'fresh', quote),
				writeCachedQuote(edgeCache, cacheOrigin, 'last', quote),
			]);
			return json(quote, 200, 'miss');
		} catch (error) {
			const fallback = cached?.quote ?? await readCachedQuote(edgeCache, cacheOrigin, 'last', from, to);
			if (fallback) return json({ ...fallback, isFallback: true } satisfies TransferRateQuote, 200, 'stale');
			return json(
				{ error: error instanceof Error ? error.message : 'Exchange rate unavailable' },
				502,
			);
		}
	};
}

export const handleTransferRate = createTransferRateHandler();
