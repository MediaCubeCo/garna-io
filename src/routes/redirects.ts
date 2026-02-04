import { RouteInfo } from '../utils/routes';
import { getLanguageFromIP } from '../utils/locale';

/**
 * Handles URL redirects for normalization and locale detection
 * @param routeInfo Parsed route information
 * @param country Country code from Cloudflare (e.g., 'US', 'BR', 'ES')
 * @param requestUrl Full request URL
 * @returns Redirect response if needed, null otherwise
 */
export async function handleRedirect(
	routeInfo: RouteInfo,
	country: string,
	requestUrl: string
): Promise<Response | null> {
	const url = new URL(requestUrl);

	// Handle root path - redirect to locale-prefixed path
	if (url.pathname === '/' || url.pathname === '') {
		const language = getLanguageFromIP(country);
		const queryString = routeInfo.query ? `?${routeInfo.query}` : '';
		const hashString = routeInfo.hash ? `#${routeInfo.hash}` : '';
		const targetUrl = `${url.origin}/${language}${queryString}${hashString}`;
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

	// Handle invalid locale format - detect language from IP and redirect
	if (routeInfo.error === 'Invalid locale format in path') {
		const language = getLanguageFromIP(country);
		const pathSegments = routeInfo.pathSegments.join('/');
		const newPath = pathSegments ? `/${language}/${pathSegments}` : `/${language}`;
		const queryString = routeInfo.query ? `?${routeInfo.query}` : '';
		const hashString = routeInfo.hash ? `#${routeInfo.hash}` : '';
		const targetUrl = `${url.origin}${newPath}${queryString}${hashString}`;
		return Response.redirect(targetUrl, 302);
	}

	return null;
}
