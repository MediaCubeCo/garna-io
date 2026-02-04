import { getLanguageFromIP } from '../utils/locale';
import { injectHtmlLangTag } from '../utils/htmlLang';
import { injectCanonicalTag } from '../utils/canonical';
import { injectHreflangTags } from '../utils/hreflang';
import { injectPageTranslations } from '../utils/page-translations';
import { RouteInfo } from '../utils/routes';

const securityHeaders = {
	'Content-Security-Policy': "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'",
	'X-XSS-Protection': '1; mode=block',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'geolocation=(self), microphone=()',
};

/**
 * Shows 404 page with proper locale detection
 * @param request Request object
 * @param pathname Requested path
 * @param country Country code from Cloudflare
 * @param env Worker environment
 * @returns 404 response with localized page
 */
export async function show404Page(request: Request, pathname: string, country: string, env?: any): Promise<Response> {
	const language = getLanguageFromIP(country);

	try {
		// Try to fetch 404 page from static assets
		const useStaticAssetsFlag = env?.USE_STATIC_ASSETS === 'true';
		const hasAssetsBinding = env?.ASSETS !== undefined;

		if (useStaticAssetsFlag && hasAssetsBinding && env?.ASSETS) {
			// Fetch 404.html from /pages/404/404.html
			const assetPath = '/pages/404/404.html';
			const assetUrl = new URL(assetPath, request.url);
			const assetRequest = new Request(assetUrl.toString(), {
				method: 'GET',
				headers: request.headers,
			});

			const response = await env.ASSETS.fetch(assetRequest);

			if (response.ok) {
				// Read HTML content
				let html = await response.text();

				// Create a RouteInfo object for 404 page
				const routeInfo: RouteInfo = {
					locale: language,
					language: language,
					region: null,
					pathSegments: ['404'],
					isValid: true,
					query: '',
					hash: '',
				};
				const baseUrl = 'https://garna.io';

				// Apply HTML modifications
				html = injectHtmlLangTag(html, language);
				html = injectCanonicalTag(html, language, '404');
				html = injectHreflangTags(html, '404');
				html = injectPageTranslations(html, '404', routeInfo, baseUrl, env);

				// Return response with modified HTML and security headers
				const responseHeaders = new Headers();
				responseHeaders.set('Content-Type', 'text/html; charset=utf-8');
				responseHeaders.set('Cache-Control', 'public, max-age=3600');

				// Add security headers
				for (const [key, value] of Object.entries(securityHeaders)) {
					responseHeaders.set(key, value);
				}

				return new Response(html, {
					status: 404,
					headers: responseHeaders,
				});
			}
		}
	} catch (error: any) {
		console.error('[show404Page] Error loading 404 page:', error);
	}

	// Fallback to simple 404 response if static asset not available
	const fallbackHtml = `<!DOCTYPE html>
<html lang="${language}">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>404 - Page Not Found</title>
	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100vh;
			margin: 0;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
		}
		.container {
			text-align: center;
			padding: 2rem;
		}
		h1 {
			font-size: 6rem;
			margin: 0;
		}
		p {
			font-size: 1.5rem;
			margin: 1rem 0;
		}
		a {
			color: white;
			text-decoration: underline;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>404</h1>
		<p>Page Not Found</p>
		<p><a href="/${language}">Go to Homepage</a></p>
	</div>
</body>
</html>`;

	const responseHeaders = new Headers();
	responseHeaders.set('Content-Type', 'text/html; charset=utf-8');

	// Add security headers
	for (const [key, value] of Object.entries(securityHeaders)) {
		responseHeaders.set(key, value);
	}

	return new Response(fallbackHtml, {
		status: 404,
		headers: responseHeaders,
	});
}
