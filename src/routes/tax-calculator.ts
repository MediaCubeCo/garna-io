import { calculatorCountryNames } from '../data/calculator-countries';

const CALCULATOR_ORIGIN = 'https://taxes.yv144.com';
const CALCULATOR_API = 'https://api-prod.letsdeel.com/employment_cost';
const MAX_COMPARISON_COUNTRIES = 2;

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': status === 200 ? 'public, max-age=86400' : 'no-store',
		},
	});

function decodeHtml(value: string): string {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&#x27;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>');
}

function parseOptions(html: string, selectName: string) {
	const select = html.match(new RegExp(`<select[^>]+name=["']${selectName}["'][^>]*>([\\s\\S]*?)<\\/select>`, 'i'))?.[1];
	if (!select) return [];
	return [...select.matchAll(/<option[^>]+value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi)].map((match) => ({
		value: decodeHtml(match[1]),
		label: decodeHtml(match[2].replace(/<[^>]+>/g, '').trim()),
	}));
}

export async function handleTaxCalculator(request: Request): Promise<Response | null> {
	const url = new URL(request.url);
	if (!url.pathname.startsWith('/api/tax-calculator/')) return null;

	if (url.pathname === '/api/tax-calculator/config' && request.method === 'GET') {
		const country = (url.searchParams.get('country') || '').toUpperCase();
		if (!/^[A-Z]{2}$/.test(country)) return json({ error: 'Invalid country' }, 400);
		try {
			const response = await fetch(`${CALCULATOR_ORIGIN}/states/?country=${country}`);
			if (!response.ok) throw new Error(`Configuration service returned ${response.status}`);
			const html = await response.text();
			return json({ states: parseOptions(html, 'state'), currencies: parseOptions(html, 'currency') });
		} catch (error: any) {
			return json({ error: error?.message || 'Configuration is temporarily unavailable' }, 502);
		}
	}

	if (url.pathname === '/api/tax-calculator/calculate' && request.method === 'POST') {
		try {
			const input = (await request.json()) as Record<string, unknown>;
			const salary = Number(input.salary);
			const currency = String(input.currency || 'USD').toUpperCase();
			const requestedCountries = Array.isArray(input.countries)
				? input.countries
				: input.country
					? [{ countryCode: input.country, state: input.state }]
					: [];
			const countries = requestedCountries
				.slice(0, MAX_COMPARISON_COUNTRIES)
				.map((entry) => {
					const value = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : {};
					const countryCode = String(value.countryCode || '').toUpperCase();
					return {
						countryCode,
						country: calculatorCountryNames.get(countryCode),
						state: value.state ? String(value.state) : undefined,
					};
				});
			if (
				!countries.length ||
				countries.some(({ countryCode, country }) => !/^[A-Z]{2}$/.test(countryCode) || !country) ||
				new Set(countries.map(({ countryCode }) => countryCode)).size !== countries.length ||
				!Number.isFinite(salary) ||
				salary < 12 ||
				!/^[A-Z]{3}$/.test(currency)
			) {
				return json({ error: 'Invalid calculator input' }, 400);
			}

			const monthlySalary = Math.round((salary / 12) * 100) / 100;
			const calculations = await Promise.all(
				countries.map(async ({ countryCode, country, state }) => {
					try {
						const response = await fetch(CALCULATOR_API, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
							body: JSON.stringify({ country, salary: monthlySalary, currency, ...(state ? { state } : {}) }),
						});
						const result = (await response.json()) as Record<string, any>;
						if (!response.ok || result.error || result.errors?.length) {
							throw new Error(result.error || result.errors?.join(', ') || `Calculation returned ${response.status}`);
						}

						const costs = (Array.isArray(result.costs) ? result.costs : []).map((cost: Record<string, unknown>) => {
							const monthly = Number(cost.priceExchanged ?? cost.amount ?? cost.price ?? 0);
							return {
								name: String(cost.name || 'Employment cost'),
								annual: Math.round(monthly * 12 * 100) / 100,
								rate: cost.rate ? String(cost.rate) : undefined,
							};
						});
						const employerCostAnnual = Math.round(costs.reduce((total, cost) => total + cost.annual, 0) * 100) / 100;
						return {
							ok: true as const,
							countryCode,
							country,
							state,
							currency,
							grossAnnual: Math.round(salary * 100) / 100,
							employerCostAnnual,
							totalAnnual: Math.round((salary + employerCostAnnual) * 100) / 100,
							netAnnual: Math.round(Number(result.netSalary || 0) * 12 * 100) / 100,
							costs,
						};
					} catch (error: any) {
						return { ok: false as const, countryCode, country, state, error: error?.message || 'Calculation failed' };
					}
				}),
			);

			const results = calculations.filter((calculation) => calculation.ok);
			const errors = calculations.filter((calculation) => !calculation.ok);
			if (!results.length) return json({ error: errors[0]?.error || 'Calculation is temporarily unavailable' }, 502);
			return json({ currency, grossAnnual: salary, results, errors });
		} catch (error: any) {
			return json({ error: error?.message || 'Calculation is temporarily unavailable' }, 502);
		}
	}

	return json({ error: 'Not found' }, 404);
}
