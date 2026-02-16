import { basePaths, PageConfig } from '../config/pages';
import { RouteInfo } from '../utils/routes';
import { languages } from '../config/languages';
import { getPageTranslations } from '../pages/i18n';
import { injectHtmlLangTag } from '../utils/htmlLang';
import { injectCanonicalTag } from '../utils/canonical';
import { injectHreflangTags } from '../utils/hreflang';
import { injectSchemaOrg } from '../utils/schema';
import { injectPageTranslations } from '../utils/page-translations';
import { HEADER_PLACEHOLDER, buildHeaderHtml } from '../utils/header';

const securityHeaders = {
	'Content-Security-Policy': "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'",
	'X-XSS-Protection': '1; mode=block',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'geolocation=(self), microphone=()',
};

function findPageConfig(segments: string[]): PageConfig | null {
	const fullPath = segments.join('/');
	let pageConfig = basePaths.find((p) => p.path === fullPath);
	if (pageConfig) return pageConfig;

	return null;
}

export async function handleDynamic(request: Request, routeInfo: RouteInfo, env?: any): Promise<Response | null> {
	if (!routeInfo.isValid || !routeInfo.locale || !routeInfo.language) {
		return null;
	}

	const pageConfig = findPageConfig(routeInfo.pathSegments);
	if (!pageConfig) return null;

	const allowedLangs = languages.map((l) => l.value);
	if (!allowedLangs.includes(routeInfo.language)) return null;

	switch (pageConfig.mode) {
		case 'static':
			return serveStaticPage(request, routeInfo, pageConfig, env);
		default:
			return null;
	}
}

// Mapping of page paths to directory names
const PAGE_PATH_TO_DIR: Record<string, string> = {
	'': 'home',
	'for-contractors': 'offer',
};

async function serveStaticPage(
	request: Request,
	routeInfo: RouteInfo,
	pageConfig: PageConfig,
	env?: any
): Promise<Response | null> {
	const useStaticAssetsFlag = env?.USE_STATIC_ASSETS === 'true';
	const hasAssetsBinding = env?.ASSETS !== undefined;

	if (!useStaticAssetsFlag || !hasAssetsBinding || !env?.ASSETS) {
		const errorMsg =
			`Static Assets required but not available!\n\n` +
			`USE_STATIC_ASSETS: ${env?.USE_STATIC_ASSETS}\n` +
			`hasAssetsBinding: ${hasAssetsBinding}\n` +
			`Please configure Static Assets in wrangler.toml`;
		console.error(errorMsg);
		return new Response(errorMsg, {
			status: 500,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
	}

	const pagePath = pageConfig.path;
	const pageDir = PAGE_PATH_TO_DIR[pagePath];

	if (!pageDir) {
		console.error(`[serveStaticPage] No directory mapping for page path: ${pagePath}`);
		return null;
	}

	try {
		// Construct asset path: /pages/{pageDir}/{pageDir}.html
		const assetPath = `/pages/${pageDir}/${pageDir}.html`;
		const assetUrl = new URL(assetPath, request.url);
		const assetRequest = new Request(assetUrl.toString(), {
			method: 'GET',
			headers: request.headers,
		});

		const response = await env.ASSETS.fetch(assetRequest);

		if (!response.ok) {
			console.error(`[serveStaticPage] Asset fetch failed: ${response.status} ${response.statusText}`);
			return null;
		}

		// Read HTML content
		let html = await response.text();

		// Inject shared header when enabled for this page
		if (pageConfig.showHeader === true) {
			html = html.replace(HEADER_PLACEHOLDER, buildHeaderHtml(routeInfo.language ?? 'en', pageConfig.path));
		}

		// Apply HTML modifications
		const language = routeInfo.language || 'en';
		const path = routeInfo.pathSegments.join('/');
		const baseUrl = 'https://garna.io';

		// 1. Inject html lang attribute
		html = injectHtmlLangTag(html, language);

		// 2. Inject canonical tag
		html = injectCanonicalTag(html, routeInfo.locale || 'en', path);

		// 3. Inject hreflang tags
		html = injectHreflangTags(html, path);

		// 4. Inject Schema.org JSON-LD
		const canonicalUrl = `${baseUrl}/${language}${path ? `/${path}` : ''}`;
		const currentMeta = (getPageTranslations(pageDir, language) as any)?.meta;
		const pageTitle = currentMeta?.title;
		const pageDescription = currentMeta?.description;
		html = injectSchemaOrg(html, canonicalUrl, pageTitle, pageDescription);

		// 5. Inject page translations
		html = injectPageTranslations(html, pageDir, routeInfo, baseUrl, env);

		// Return response with modified HTML and security headers
		const responseHeaders = new Headers();
		responseHeaders.set('Content-Type', 'text/html; charset=utf-8');
		responseHeaders.set('Cache-Control', 'public, max-age=3600');

		// Add security headers
		for (const [key, value] of Object.entries(securityHeaders)) {
			responseHeaders.set(key, value);
		}

		return new Response(html, {
			status: 200,
			headers: responseHeaders,
		});
	} catch (error: any) {
		console.error(`[serveStaticPage] Error serving static page:`, error);
		return new Response(`Error serving page: ${error?.message || 'Unknown error'}`, {
			status: 500,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
	}
}
