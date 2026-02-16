import { RouteInfo } from '../utils/routes';
import { getSupportedLanguageCodes } from '../config/languages';

const DEFAULT_LANGUAGE = 'en';

/**
 * Handles URL redirects for normalization. Default language is always English (no locale detection).
 */
export async function handleRedirect(
	routeInfo: RouteInfo,
	_country: string,
	requestUrl: string
): Promise<Response | null> {
	const url = new URL(requestUrl);

	// Handle root path - redirect to English (default)
	if (url.pathname === '/' || url.pathname === '') {
		const queryString = routeInfo.query ? `?${routeInfo.query}` : '';
		const hashString = routeInfo.hash ? `#${routeInfo.hash}` : '';
		const targetUrl = `${url.origin}/${DEFAULT_LANGUAGE}${queryString}${hashString}`;
		return Response.redirect(targetUrl, 302);
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
		const pathSegments = routeInfo.pathSegments.join('/');
		const newPath = pathSegments ? `/${DEFAULT_LANGUAGE}/${pathSegments}` : `/${DEFAULT_LANGUAGE}`;
		const queryString = routeInfo.query ? `?${routeInfo.query}` : '';
		const hashString = routeInfo.hash ? `#${routeInfo.hash}` : '';
		const targetUrl = `${url.origin}${newPath}${queryString}${hashString}`;
		return Response.redirect(targetUrl, 302);
	}

	return null;
}
