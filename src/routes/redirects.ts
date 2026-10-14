import { RouteInfo } from '../utils/routes';
import { getSupportedLanguageCodes } from '../config/languages';
import { basePaths } from '../config/pages';
import { countries } from '../config/countries';

const DEFAULT_LANGUAGE = 'en';
const pagePaths = new Set(basePaths.map((page) => page.path));
const legacyPageRedirects: Record<string, string> = {
	'mid-size': 'mid-size-business-payroll',
};
const eventLegacyRedirects: Record<string, string> = {
	'websummit-2026-side-events': 'event/websummit-2026',
	'gamescom-2026-side-events': 'event/gamescom-2026',
};

function languageForCountry(country: string): string {
	const match = countries.find((item) => item.value === country.toUpperCase());
	const language = match?.defaultLanguage?.toLowerCase();
	if (language && getSupportedLanguageCodes().includes(language)) return language;
	return DEFAULT_LANGUAGE;
}

function languageFromAcceptLanguage(header: string | null | undefined): string | null {
	if (!header) return null;
	const supported = new Set(getSupportedLanguageCodes());
	const ranked = header
		.split(',')
		.map((part) => {
			const [tag, ...params] = part.trim().split(';');
			const qualityParam = params.find((param) => param.trim().startsWith('q='));
			const quality = qualityParam ? Number(qualityParam.trim().slice(2)) : 1;
			return { tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 0 };
		})
		.filter((part) => part.tag)
		.sort((left, right) => right.quality - left.quality);

	for (const part of ranked) {
		const language = part.tag.split('-')[0];
		if (supported.has(language)) return language;
	}
	return null;
}

function languageForVisitor(country: string, acceptLanguage?: string | null): string {
	return languageFromAcceptLanguage(acceptLanguage) ?? languageForCountry(country);
}

function redirectToEvent(url: URL, pagePath: string, language: string, status: 301 | 302 = 301): Response {
	return Response.redirect(`${url.origin}/${language}/${pagePath}${url.search}`, status);
}

function buildLocalizedTarget(
	url: URL,
	pathSegments: string[],
	status: 301 | 302 = 302
): Response {
	const normalizedSegments = [...pathSegments];
	const lastSegment = normalizedSegments[normalizedSegments.length - 1];
	if (lastSegment?.endsWith('.html')) {
		normalizedSegments[normalizedSegments.length - 1] = lastSegment.replace(/\.html$/u, '');
	}

	const normalizedPath = normalizedSegments.join('/');
	const pagePath = normalizedPath === 'index' ? '' : normalizedPath;
	const localizedPath = pagePath ? `/${DEFAULT_LANGUAGE}/${pagePath}` : `/${DEFAULT_LANGUAGE}`;
	const targetUrl = `${url.origin}${localizedPath}${url.search}`;

	return Response.redirect(targetUrl, status);
}

/**
 * Handles URL redirects for normalization. Default language is always English (no locale detection).
 */
export async function handleRedirect(
	routeInfo: RouteInfo,
	country: string,
	requestUrl: string,
	acceptLanguage?: string | null
): Promise<Response | null> {
	const url = new URL(requestUrl);

	// Handle root path - redirect to English (default)
	if (url.pathname === '/' || url.pathname === '') {
		return buildLocalizedTarget(url, [], 302);
	}

	if (routeInfo.isValid && routeInfo.pathSegments.join('/') === 'eor') {
		const queryString = routeInfo.query ? `?${routeInfo.query}` : '';
		const hashString = routeInfo.hash ? `#${routeInfo.hash}` : '';
		const targetUrl = `${url.origin}/${routeInfo.locale}/employer-of-record${queryString}${hashString}`;
		return Response.redirect(targetUrl, 301);
	}

	if (routeInfo.isValid && routeInfo.locale) {
		const normalizedPath = routeInfo.pathSegments
			.join('/')
			.replace(/(^|\/)index\.html$/u, '')
			.replace(/\.html$/u, '');
		const eventPath = eventLegacyRedirects[normalizedPath];
		if (eventPath && routeInfo.locale) {
			return redirectToEvent(url, eventPath, routeInfo.locale, 301);
		}
		const redirectPath = legacyPageRedirects[normalizedPath];
		if (redirectPath) {
			const queryString = routeInfo.query ? `?${routeInfo.query}` : '';
			const hashString = routeInfo.hash ? `#${routeInfo.hash}` : '';
			const targetUrl = `${url.origin}/${routeInfo.locale}/${redirectPath}${queryString}${hashString}`;
			return Response.redirect(targetUrl, 301);
		}
	}

	// Handle valid path but unsupported locale - redirect to default (English)
	if (routeInfo.isValid && routeInfo.language && !getSupportedLanguageCodes().includes(routeInfo.language)) {
		const pathSegments = routeInfo.pathSegments.join('/');
		const newPath = pathSegments ? `/${DEFAULT_LANGUAGE}/${pathSegments}` : `/${DEFAULT_LANGUAGE}`;
		const queryString = routeInfo.query ? `?${routeInfo.query}` : '';
		const hashString = routeInfo.hash ? `#${routeInfo.hash}` : '';
		const targetUrl = `${url.origin}${newPath}${queryString}${hashString}`;
		return Response.redirect(targetUrl, 302);
	}

	// Handle double slashes - normalize to single slash
	if (routeInfo.error === 'Path contains double slashes') {
		const normalizedPath = url.pathname.replace(/\/+/g, '/');
		const queryString = routeInfo.query ? `?${routeInfo.query}` : '';
		const hashString = routeInfo.hash ? `#${routeInfo.hash}` : '';
		const targetUrl = `${url.origin}${normalizedPath}${queryString}${hashString}`;
		return Response.redirect(targetUrl, 301);
	}

	// Handle trailing slash - remove it
	if (routeInfo.error === 'Path contains trailing slash') {
		const pathWithoutTrailingSlash = url.pathname.replace(/\/+$/, '');
		const queryString = routeInfo.query ? `?${routeInfo.query}` : '';
		const hashString = routeInfo.hash ? `#${routeInfo.hash}` : '';
		const targetUrl = `${url.origin}${pathWithoutTrailingSlash}${queryString}${hashString}`;
		return Response.redirect(targetUrl, 301);
	}

	// Handle invalid locale casing - normalize case
	if (routeInfo.error === 'Invalid locale case' && routeInfo.locale) {
		const pathSegments = routeInfo.pathSegments.join('/');
		const normalizedPath = pathSegments ? `/${routeInfo.locale}/${pathSegments}` : `/${routeInfo.locale}`;
		const queryString = routeInfo.query ? `?${routeInfo.query}` : '';
		const hashString = routeInfo.hash ? `#${routeInfo.hash}` : '';
		const targetUrl = `${url.origin}${normalizedPath}${queryString}${hashString}`;
		return Response.redirect(targetUrl, 301);
	}

	// Handle invalid locale format - redirect to default (English)
	if (routeInfo.error === 'Invalid locale format in path') {
		const pathSegments = [...routeInfo.pathSegments];
		const normalizedPath = pathSegments
			.join('/')
			.replace(/(^|\/)index\.html$/u, '')
			.replace(/\.html$/u, '');

		const legacyEventPath = eventLegacyRedirects[normalizedPath];
		if (legacyEventPath) {
			return redirectToEvent(url, legacyEventPath, languageForVisitor(country, acceptLanguage), 301);
		}
		if (normalizedPath.startsWith('event/') && pagePaths.has(normalizedPath)) {
			return redirectToEvent(url, normalizedPath, languageForVisitor(country, acceptLanguage), 302);
		}

		if (pagePaths.has(normalizedPath)) {
			return buildLocalizedTarget(url, pathSegments, 302);
		}

		const redirectPath = legacyPageRedirects[normalizedPath];
		if (redirectPath) {
			return buildLocalizedTarget(url, [redirectPath], 301);
		}
	}

	return null;
}
