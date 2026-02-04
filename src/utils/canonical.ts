const BASE_DOMAIN = 'https://garna.io';

/**
 * Injects canonical tag and og:url meta tag into HTML
 * @param html HTML content
 * @param locale Locale code (e.g., 'en', 'es', 'pt', 'ru')
 * @param path Path segments joined with '/' (e.g., '', 'offer')
 * @returns Modified HTML with canonical tags
 */
export function injectCanonicalTag(html: string, locale: string, path: string): string {
	const fullPath = path ? `/${locale}/${path}` : `/${locale}`;
	const canonicalUrl = `${BASE_DOMAIN}${fullPath}`;

	// Create canonical link tag
	const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;

	// Create og:url meta tag
	const ogUrlTag = `<meta property="og:url" content="${canonicalUrl}" />`;

	// Check if there's already a canonical tag
	if (html.includes('<link rel="canonical"')) {
		// Replace existing canonical tag
		html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, canonicalTag);
	} else {
		// Insert canonical tag before </head>
		html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
	}

	// Check if there's already an og:url tag
	if (html.includes('<meta property="og:url"') || html.includes('<meta name="og:url"')) {
		// Replace existing og:url tag
		html = html.replace(/<meta\s+(?:property|name)="og:url"[^>]*>/gi, ogUrlTag);
	} else {
		// Insert og:url tag before </head>
		html = html.replace('</head>', `  ${ogUrlTag}\n</head>`);
	}

	return html;
}
