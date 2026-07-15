const CALCULATOR_ORIGIN = 'https://taxes.yv144.com';
const CALCULATOR_API = 'https://api-prod.letsdeel.com/guest/take_home_calculator/calculate';

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
			const country = String(input.country || '').toUpperCase();
			const salary = Number(input.salary);
			const currency = String(input.currency || 'USD').toUpperCase();
			const period = input.period === 'annual' ? 'annual' : 'monthly';
			const state = input.state ? String(input.state) : undefined;
			if (!/^[A-Z]{2}$/.test(country) || !Number.isFinite(salary) || salary <= 0 || !/^[A-Z]{3}$/.test(currency)) {
				return json({ error: 'Invalid calculator input' }, 400);
			}
			const response = await fetch(CALCULATOR_API, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({ country, salary: Math.round(salary), currency, period, ...(state ? { state } : {}) }),
			});
			const result = await response.json();
			return json(result, response.ok ? 200 : response.status);
		} catch (error: any) {
			return json({ error: error?.message || 'Calculation is temporarily unavailable' }, 502);
		}
	}

	return json({ error: 'Not found' }, 404);
}
