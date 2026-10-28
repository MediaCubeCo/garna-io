import { shortLinks } from '../config/short-links';

/** Own the /s namespace before assets and locale routing. */
export function handleShortLink(request: Request): Response | null {
	const url = new URL(request.url);
	if (url.pathname !== '/s' && !url.pathname.startsWith('/s/')) return null;

	const slug = /^\/s\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(url.pathname)?.[1];
	if (!slug || !Object.prototype.hasOwnProperty.call(shortLinks, slug)) {
		return new Response(request.method === 'HEAD' ? null : 'Short link not found', {
			status: 404,
			headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
		});
	}

	if (request.method !== 'GET' && request.method !== 'HEAD') {
		return new Response(null, {
			status: 405,
			headers: { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' },
		});
	}

	// Use only the registered destination; incoming parameters cannot replace campaign attribution.
	return new Response(null, {
		status: 302,
		headers: {
			Location: new URL(shortLinks[slug], url.origin).toString(),
			'Cache-Control': 'no-store',
		},
	});
}
