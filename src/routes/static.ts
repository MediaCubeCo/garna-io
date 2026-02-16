import { routes } from '../utils/routes';
import { getSupportedLanguageCodes } from '../config/languages';
import { basePaths } from '../config/pages';

const BASE_DOMAIN = 'https://garna.io';

function checkIfPageSearchable(routePath: string): boolean {
	// Extract locale and path of page from full route path
	// Support formats: /{lang}/... and /{lang}-{region}/...
	const localeMatch = routePath.match(/^\/([a-z]{2})(?:[-_]([a-z]{2}))?\/(.*)$/i);
	if (!localeMatch) {
		// If path doesn't match format with locale, check as is
		const pathWithoutSlash = routePath.replace(/^\//, '');
		const pageConfig = basePaths.find((page) => page.path === pathWithoutSlash);
		if (pageConfig && pageConfig.searchable === false) {
			return false;
		}
		return true;
	}

	const [, , , pagePath] = localeMatch;
	const normalizedPath = pagePath || '';

	// Find page configuration
	const pageConfig = basePaths.find((page) => page.path === normalizedPath);

	// If searchable is explicitly set to false, page is not indexed
	if (pageConfig && pageConfig.searchable === false) {
		return false;
	}

	return true;
}

function getNonSearchablePages(): string[] {
	return basePaths
		.filter((page) => page.searchable === false)
		.map((page) => `/${page.path}/`)
		.concat(basePaths.filter((page) => page.searchable === false).map((page) => `/${page.path}`));
}

export async function generateLocaleSitemap(locale: string): Promise<string> {
	const urls: string[] = [];

	// Add all static routes for this locale
	for (const [path, config] of Object.entries(routes)) {
		if (!path.startsWith(`/${locale}`)) continue;

		const isSearchable = checkIfPageSearchable(path);
		if (!isSearchable) {
			continue;
		}
		const fullUrl = `${BASE_DOMAIN}${path}`;
		urls.push(fullUrl);
	}

	urls.sort();

	const sitemapEntries = urls
		.map(
			(url) =>
				`  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>`;
}

export function generateSitemapIndex(): string {
	const today = new Date().toISOString().split('T')[0];
	let sitemaps: string[] = getSupportedLanguageCodes().map(
		(locale) =>
			`  <sitemap>\n    <loc>${BASE_DOMAIN}/${locale}/sitemap.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`
	);

	return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps.join(
		'\n'
	)}\n</sitemapindex>`;
}

export function generateRobotsTxt(): string {
	const nonSearchablePages = getNonSearchablePages();
	const disallowEntries = nonSearchablePages.map((path) => `Disallow: ${path}`).join('\n');

	const baseRules = `User-agent: *
Allow: /*.css
Allow: /*.js*
Allow: /*.jpg
Allow: /*.png
Allow: /*.gif
Allow: /*.svg
Allow: /*.xml
Allow: /

Sitemap: ${BASE_DOMAIN}/sitemap-index.xml

# Block access to restricted areas
Disallow: /auth/
Disallow: *?
Disallow: /cdn-cgi/
Disallow: /admin/
Disallow: /private/
Disallow: /.well-known/
Disallow: /api/internal/`;

	if (disallowEntries) {
		return `${baseRules}

# Block non-searchable pages
${disallowEntries}

# Crawl delay for respectful crawling
Crawl-delay: 1`;
	}

	return `${baseRules}

# Crawl delay for respectful crawling
Crawl-delay: 1`;
}

/**
 * Gets MIME type based on file extension
 */
function getMimeType(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase() || '';
	const mimeTypes: Record<string, string> = {
		// CSS
		css: 'text/css',
		// JavaScript
		js: 'application/javascript',
		mjs: 'application/javascript',
		// Images
		png: 'image/png',
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		gif: 'image/gif',
		svg: 'image/svg+xml',
		webp: 'image/webp',
		avif: 'image/avif',
		ico: 'image/x-icon',
		// Fonts
		woff: 'font/woff',
		woff2: 'font/woff2',
		ttf: 'font/ttf',
		otf: 'font/otf',
		eot: 'application/vnd.ms-fontobject',
		// Other
		json: 'application/json',
		xml: 'application/xml',
		pdf: 'application/pdf',
		html: 'text/html',
		htm: 'text/html',
	};
	return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Handles serving pages assets from /static-files/pages/** paths
 * Serves files from Cloudflare Static Assets (not bundled)
 */
async function handlePagesAssets(request: Request, pathname: string, env?: any): Promise<Response | null> {
	// Check if path starts with /static-files/pages/
	if (!pathname.startsWith('/static-files/pages/')) {
		return null;
	}

	// Check if Static Assets should be used
	const useStaticAssetsFlag = env?.USE_STATIC_ASSETS === 'true';
	const hasAssetsBinding = env?.ASSETS !== undefined;
	const useStaticAssets = useStaticAssetsFlag && hasAssetsBinding;

	if (!useStaticAssetsFlag) {
		// Fall through to else block
	} else if (!hasAssetsBinding) {
		const errorMsg =
			`Static Assets enabled but ASSETS binding not available!\n\n` +
			`USE_STATIC_ASSETS: ${env?.USE_STATIC_ASSETS}\n` +
			`hasAssetsBinding: ${hasAssetsBinding}\n` +
			`env keys: ${env ? Object.keys(env).join(', ') : 'env is null/undefined'}\n\n` +
			`Please check:\n` +
			`1. wrangler.toml has [assets] section with directory and binding\n` +
			`2. Restart dev server after changing wrangler.toml\n` +
			`3. Wrangler version supports Static Assets (4.18.0+)`;
		console.error(errorMsg);
		return new Response(errorMsg, {
			status: 500,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
	}

	if (useStaticAssets && env?.ASSETS) {
		// New method: serve from Static Assets
		try {
			// Double-check ASSETS is available before using
			if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
				throw new Error('ASSETS binding is not a valid Fetcher');
			}

			// Map /static-files/pages/* to /pages/* for ASSETS.fetch
			// ASSETS.fetch expects paths relative to the assets directory
			const assetPath = pathname.replace(/^\/static-files/, '');
			const assetUrl = new URL(assetPath, request.url);
			const assetRequest = new Request(assetUrl.toString(), {
				method: request.method,
				headers: request.headers,
			});
			const response = await env.ASSETS.fetch(assetRequest);

			if (response.status === 404) {
				console.warn(`Static page asset not found: ${pathname}`);
				return new Response('Page asset not found', {
					status: 404,
					headers: { 'Content-Type': 'text/plain; charset=utf-8' },
				});
			}

			// Clone response and add cache headers
			const headers = new Headers(response.headers);
			headers.set('Cache-Control', 'public, max-age=31536000, immutable');

			return new Response(response.body, {
				status: response.status,
				headers,
			});
		} catch (error: any) {
			const errorDetails = {
				message: error?.message || 'Unknown error',
				stack: error?.stack,
				pathname,
				hasAssets: !!env?.ASSETS,
				useStaticAssets,
				errorType: error?.constructor?.name,
			};
			console.error(`Error serving page asset from Static Assets (${pathname}):`, errorDetails);
			const errorText = `Error loading page asset: ${errorDetails.message}\n\nDetails: ${JSON.stringify(
				errorDetails,
				null,
				2
			)}`;
			return new Response(errorText, {
				status: 500,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' },
			});
		}
	} else {
		// This should never be reached when USE_STATIC_ASSETS=true
		// If reached, it means Static Assets is disabled or misconfigured
		const errorMsg =
			`Page assets can only be served via Static Assets.\n\n` +
			`Please ensure:\n` +
			`1. USE_STATIC_ASSETS is set to "true" in wrangler.toml\n` +
			`2. [assets] section is configured with directory = "./public" and binding = "ASSETS"\n` +
			`3. Restart dev server after configuration changes`;
		console.error(errorMsg);
		return new Response(errorMsg, {
			status: 500,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
	}
}

export async function handleStaticFile(request: Request, pathname: string, env?: any): Promise<Response | null> {
	// Check for pages assets
	const pagesAssetResponse = await handlePagesAssets(request, pathname, env);
	if (pagesAssetResponse) {
		return pagesAssetResponse;
	}

	// Handle widget files from /widget/*
	if (pathname.startsWith('/widget/')) {
		const useStaticAssetsFlag = env?.USE_STATIC_ASSETS === 'true';
		const hasAssetsBinding = env?.ASSETS !== undefined;

		if (useStaticAssetsFlag && hasAssetsBinding && env?.ASSETS) {
			try {
				const assetUrl = new URL(pathname, request.url);
				const assetRequest = new Request(assetUrl.toString(), {
					method: request.method,
					headers: request.headers,
				});
				const response = await env.ASSETS.fetch(assetRequest);

				if (response.status === 404) {
					console.warn(`Widget asset not found: ${pathname}`);
					return new Response('Widget asset not found', {
						status: 404,
						headers: { 'Content-Type': 'text/plain; charset=utf-8' },
					});
				}

				// Clone response and add cache headers
				const headers = new Headers(response.headers);
				const mimeType = getMimeType(pathname);
				headers.set('Content-Type', mimeType);
				headers.set('Cache-Control', 'public, max-age=31536000, immutable');

				return new Response(response.body, {
					status: response.status,
					headers,
				});
			} catch (error: any) {
				console.error(`Error serving widget asset (${pathname}):`, error);
				return new Response(`Error loading widget asset: ${error?.message || 'Unknown error'}`, {
					status: 500,
					headers: { 'Content-Type': 'text/plain; charset=utf-8' },
				});
			}
		}
	}

	const headers = {
		'Content-Type': 'text/xml; charset=utf-8',
		'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
	};

	// New handler for locale sitemaps
	const localeSitemapMatch = pathname.match(/^\/([a-z]{2})\/sitemap\.xml$/);
	if (localeSitemapMatch) {
		const locale = localeSitemapMatch[1];
		if (getSupportedLanguageCodes().includes(locale)) {
			const sitemapContent = await generateLocaleSitemap(locale);
			return new Response(sitemapContent, { headers });
		} else {
			return new Response('Not found', { status: 404 });
		}
	}

	switch (pathname) {
		case '/sitemap.xml':
			// For backward compatibility can leave redirect or empty sitemap
			return new Response(
				'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
				{
					headers,
				}
			);

		case '/sitemap-index.xml':
			return new Response(generateSitemapIndex(), { headers });

		case '/robots.txt':
			return new Response(generateRobotsTxt(), {
				headers: {
					'Content-Type': 'text/plain; charset=utf-8',
					'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
				},
			});

		default:
			return null;
	}
}
