import { getSupportedLanguageCodes } from '../config/languages';

const BASE_DOMAIN = 'https://garna.io';

/**
 * Injects hreflang alternate tags into HTML for all supported languages
 * @param html HTML content
 * @param path Path segments joined with '/' (e.g., '', 'offer')
 * @returns Modified HTML with hreflang tags
 */
export function injectHreflangTags(html: string, path: string): string {
	const languages = getSupportedLanguageCodes();

	// Build hreflang tags
	const hreflangTags: string[] = [];

	// Add tag for each supported language
	for (const lang of languages) {
		const fullPath = path ? `/${lang}/${path}` : `/${lang}`;
		const url = `${BASE_DOMAIN}${fullPath}`;
		hreflangTags.push(`  <link rel="alternate" hreflang="${lang}" href="${url}" />`);
	}

	// Add x-default pointing to English
	const defaultPath = path ? `/en/${path}` : '/en';
	const defaultUrl = `${BASE_DOMAIN}${defaultPath}`;
	hreflangTags.push(`  <link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`);

	// Check if there are already hreflang tags
	if (html.includes('rel="alternate" hreflang=')) {
		// Remove existing hreflang tags
		html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>\n?/gi, '');
	}

	// Insert hreflang tags before </head>
	const hreflangBlock = hreflangTags.join('\n') + '\n';
	html = html.replace('</head>', `${hreflangBlock}</head>`);

	return html;
}
