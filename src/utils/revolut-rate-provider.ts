export type RateQuote = {
	from: string;
	to: string;
	rate: number;
	asOf: string;
	provider: string;
};

const REVOLUT_PUBLIC_QUOTE_URL = 'https://www.revolut.com/api/quote/public';
const CURRENCY_PATTERN = /^[A-Z]{3}$/;
const PREFERRED_RATE_KEYS = ['rate', 'exchangeRate', 'exchange_rate', 'quoteRate', 'quote_rate'] as const;

type Fetcher = typeof fetch;

function positiveNumber(value: unknown): number | null {
	const number = typeof value === 'string' ? Number(value) : value;
	return typeof number === 'number' && Number.isFinite(number) && number > 0 ? number : null;
}

export function extractRevolutRate(payload: unknown): number {
	const queue: unknown[] = [payload];
	while (queue.length) {
		const value = queue.shift();
		if (!value || typeof value !== 'object') continue;
		if (Array.isArray(value)) {
			queue.push(...value);
			continue;
		}

		const object = value as Record<string, unknown>;
		for (const key of PREFERRED_RATE_KEYS) {
			const rate = positiveNumber(object[key]);
			if (rate !== null) return rate;
		}
		queue.push(...Object.values(object));
	}
	throw new Error('Revolut returned a quote without a valid rate');
}

async function fetchDirectRate(from: string, to: string, fetcher: Fetcher): Promise<number> {
	if (from === to) return 1;
	const response = await fetcher(`${REVOLUT_PUBLIC_QUOTE_URL}/${from}${to}`, {
		headers: {
			accept: 'application/json',
			'user-agent': 'Garna-Transfer-Calculator/1.0',
		},
		signal: AbortSignal.timeout(8_000),
	});
	if (!response.ok) throw new Error(`Revolut quote service returned ${response.status}`);
	const contentType = response.headers.get('content-type') ?? '';
	if (!contentType.toLowerCase().includes('application/json')) {
		throw new Error('Revolut quote service returned a non-JSON response');
	}
	return extractRevolutRate(await response.json());
}

export class RevolutRateProvider {
	constructor(private readonly fetcher: Fetcher = fetch) {}

	async getRate(from: string, to: string): Promise<RateQuote> {
		const normalizedFrom = from.toUpperCase();
		const normalizedTo = to.toUpperCase();
		if (!CURRENCY_PATTERN.test(normalizedFrom) || !CURRENCY_PATTERN.test(normalizedTo)) {
			throw new Error('Currency must be a three-letter ISO code');
		}
		if (normalizedFrom === normalizedTo) {
			return {
				from: normalizedFrom,
				to: normalizedTo,
				rate: 1,
				asOf: new Date().toISOString(),
				provider: 'Identity rate',
			};
		}

		try {
			const rate = await fetchDirectRate(normalizedFrom, normalizedTo, this.fetcher);
			return {
				from: normalizedFrom,
				to: normalizedTo,
				rate,
				asOf: new Date().toISOString(),
				provider: 'Revolut public quote',
			};
		} catch (directError) {
			try {
				const [usdToFrom, usdToTo] = await Promise.all([
					fetchDirectRate('USD', normalizedFrom, this.fetcher),
					fetchDirectRate('USD', normalizedTo, this.fetcher),
				]);
				return {
					from: normalizedFrom,
					to: normalizedTo,
					rate: usdToTo / usdToFrom,
					asOf: new Date().toISOString(),
					provider: 'Revolut public quote · cross via USD',
				};
			} catch {
				throw directError;
			}
		}
	}
}
