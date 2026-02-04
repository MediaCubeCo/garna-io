import { basePaths, PageConfig } from '../config/pages';
import { getSupportedLanguageCodes } from '../config/languages';

export interface RouteInfo {
	locale: string | null;
	language: string | null;
	region: string | null;
	pathSegments: string[];
	isValid: boolean;
	error?: string;
	query: string;
	hash: string;

	// If locale is detected - path to redirect to
	redirectTo?: string;
}

export function resolveRoute(fullPath: string): RouteInfo {
	// Split URL into path, query and hash
	const [path, query = '', hash = ''] = fullPath.split(/[?#]/);
	// Initialize result
	const result: RouteInfo = {
		locale: null,
		language: null,
		region: null,
		pathSegments: [],
		isValid: false,
		query,
		hash,
	};

	// Split path into segments, preserving empty segments
	const segments = path.split('/');

	// Check for double slashes
	if (path.includes('//')) {
		result.error = 'Path contains double slashes';
	}

	// Check for trailing slash
	if (path.endsWith('/') && path !== '/') {
		result.error = 'Path contains trailing slash';
	}

	// If no non-empty segments, route is invalid
	// segments.filter(Boolean) - Removes all empty and false values
	if (segments.filter(Boolean).length === 0) {
		result.error = 'Empty path';
		return result;
	}

	// Check if first non-empty segment matches locale pattern
	const firstSegment = segments.find((s) => s !== '');
	if (!firstSegment) {
		result.error = 'Empty path';
		return result;
	}

	const localeMatch = firstSegment.match(/^([a-zA-Z]{2})(?:[-._]([a-zA-Z]{2}))?$/);
	if (localeMatch) {
		const [, lang, reg] = localeMatch;
		let normalizedLocale: string = '';
		if (typeof reg === 'string') {
			normalizedLocale = `${lang.toLowerCase()}-${reg.toUpperCase()}`;
			result.region = reg;
		} else {
			normalizedLocale = `${lang.toLowerCase()}`;
		}

		// Always set language and region in original case
		result.language = lang;

		// Check if locale case matches exactly
		if (firstSegment !== normalizedLocale) {
			result.error = 'Invalid locale case';
			result.locale = normalizedLocale; // Set normalized locale even if case is wrong
		} else {
			result.locale = normalizedLocale;
			result.isValid = true;
		}
		// If locale is found, pathSegments after locale
		result.pathSegments = segments.slice(segments.indexOf(firstSegment) + 1);
	} else {
		result.error = 'Invalid locale format in path';
		// If locale not found, pathSegments = all non-empty segments
		result.pathSegments = segments.filter(Boolean);
	}

	return result;
}

export const routes: Record<string, string | { mode: string }> = Object.fromEntries(
	getSupportedLanguageCodes().flatMap((locale: string) =>
		basePaths.map((config: PageConfig) => {
			const path = config.path === '' ? '' : `/${config.path}`;

			const langOnlyLocale = (locale.split('-')[0] || locale).toLowerCase();
			// Get path without locale
			const routePath = `/${langOnlyLocale}${path}`;

			// Handle static mode
			return [routePath, { mode: 'static' }];
		})
	)
);
