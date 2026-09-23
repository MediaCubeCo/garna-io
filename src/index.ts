import { handleDynamic } from './routes/dynamic';
import { handleRedirect } from './routes/redirects';
import { show404Page } from './routes/404';
import { handleStaticFile } from './routes/static';
import { resolveRoute } from './utils/routes';
import { garnaBlog } from './blog/engine';
import { handleLegacyBlogRedirect } from './blog/public';
import { handleTaxCalculator } from './routes/tax-calculator';

const CANONICAL_ORIGIN = 'https://garna.io';
const DEFAULT_LANGUAGE = 'en';

export default {
	async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
		try {
			const url = new URL(request.url);
			const country = (request as any).cf?.country || 'US';

			const taxCalculatorResponse = await handleTaxCalculator(request);
			if (taxCalculatorResponse) return taxCalculatorResponse;

			// 0. Redirect www (http/https) to canonical https://garna.io/en
			if (url.hostname === 'www.garna.io') {
				const pathname = url.pathname === '/' || url.pathname === '' ? `/${DEFAULT_LANGUAGE}` : url.pathname;
				const targetUrl = `${CANONICAL_ORIGIN}${pathname}${url.search}`;
				return Response.redirect(targetUrl, 301);
			}

			// 1. Handle protected blog admin before static assets/routing
			const blogAdminResponse = await garnaBlog(env).handle(request, env);
			if (blogAdminResponse) {
				return blogAdminResponse;
			}


			// 2. Handle static files first (sitemap, robots.txt, assets)
			const staticResponse = await handleStaticFile(request, url.pathname, env);
			if (staticResponse) {
				return staticResponse;
			}

			// 3. Resolve route
			const routeInfo = resolveRoute(url.pathname + url.search);

			// 4. Handle redirects
			const redirectResponse = await handleRedirect(routeInfo, country, request.url);
			if (redirectResponse) {
				return redirectResponse;
			}

			const legacyBlogRedirect = handleLegacyBlogRedirect(request);
			if (legacyBlogRedirect) {
				return legacyBlogRedirect;
			}


			// 5. Handle static page routes
			const dynamicResponse = await handleDynamic(request, routeInfo, env);
			if (dynamicResponse) {
				return dynamicResponse;
			}

			// If we reach here, show 404
			return await show404Page(request, url.pathname, country, env);
		} catch (error: any) {
			const errorMessage = error?.message || String(error) || 'Unknown error';
			const errorStack = error?.stack || 'No stack trace';
			const errorDetails = `Worker exception: ${errorMessage}\n\nStack:\n${errorStack}\n\nError type: ${typeof error}\nError constructor: ${
				error?.constructor?.name || 'N/A'
			}`;
			return new Response(errorDetails, {
				status: 500,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' },
			});
		}
	},
};
