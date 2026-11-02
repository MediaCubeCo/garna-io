const DEFAULT_EOR_API_ORIGIN = 'https://eor-calc-maxtro.yv144.com';

const json = (body: unknown, status: number) =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'no-store',
		},
	});

/**
 * Same-origin facade for the EOR calculation engine. The upstream is
 * configurable so it can move to Garna infrastructure without changing the UI.
 */
export async function handleEorCalculator(request: Request, env: Record<string, unknown>): Promise<Response | null> {
	const url = new URL(request.url);
	if (!url.pathname.startsWith('/api/eor/')) return null;
	if (!['GET', 'POST'].includes(request.method)) return json({ message: 'Method not allowed.', code: 'method_not_allowed' }, 405);

	const configuredOrigin = typeof env.EOR_API_BASE_URL === 'string' ? env.EOR_API_BASE_URL : DEFAULT_EOR_API_ORIGIN;
	let upstreamOrigin: URL;
	try {
		upstreamOrigin = new URL(configuredOrigin);
	} catch {
		return json({ message: 'Calculator service is not configured.', code: 'calculation_unavailable' }, 503);
	}

	const upstreamUrl = new URL(url.pathname + url.search, upstreamOrigin);
	const headers = new Headers({ Accept: 'application/json' });
	const contentType = request.headers.get('Content-Type');
	const acceptLanguage = request.headers.get('Accept-Language');
	if (contentType) headers.set('Content-Type', contentType);
	if (acceptLanguage) headers.set('Accept-Language', acceptLanguage);

	try {
		const upstream = await fetch(upstreamUrl, {
			method: request.method,
			headers,
			body: request.method === 'POST' ? await request.text() : undefined,
		});
		return new Response(upstream.body, {
			status: upstream.status,
			headers: {
				'Content-Type': upstream.headers.get('Content-Type') || 'application/json; charset=utf-8',
				'Cache-Control': request.method === 'GET' && upstream.ok ? 'public, max-age=300' : 'no-store',
			},
		});
	} catch {
		return json(
			{
				message: 'The calculation service is temporarily unavailable. Please try again.',
				code: 'calculation_unavailable',
			},
			502,
		);
	}
}
