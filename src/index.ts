import { handleDynamic } from './routes/dynamic';
import { handleRedirect } from './routes/redirects';
import { show404Page } from './routes/404';
import { handleStaticFile } from './routes/static';
import { resolveRoute } from './utils/routes';

export default {
	async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
		try {
			const url = new URL(request.url);
			const country = (request as any).cf?.country || 'US';

			// 1. Handle static files first (sitemap, robots.txt, assets)
			const staticResponse = await handleStaticFile(request, url.pathname, env);
			if (staticResponse) {
				return staticResponse;
			}

			// 2. Resolve route
			const routeInfo = resolveRoute(url.pathname + url.search);

			// 3. Handle redirects
			const redirectResponse = await handleRedirect(routeInfo, country, request.url);
			if (redirectResponse) {
				return redirectResponse;
			}

			// 4. Handle dynamic routes
			const dynamicResponse = await handleDynamic(request, routeInfo, env);
			if (dynamicResponse) {
				return dynamicResponse;
			}

			// If we reach here, show 404
			return await show404Page(request, url.pathname, country, env);
		} catch (error: any) {
			console.error('Worker exception:', error);
			console.error('Error type:', typeof error);
			console.error('Error constructor:', error?.constructor?.name);
			console.error('Error message:', error?.message);
			console.error('Error stack:', error?.stack);
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
