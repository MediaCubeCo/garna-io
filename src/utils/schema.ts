const BASE_DOMAIN = 'https://garna.io';

/**
 * Injects Schema.org JSON-LD (Organization + WebSite) into HTML for SEO rich snippets.
 * @param html HTML content
 * @param pageUrl Canonical URL of the current page (e.g. https://garna.io/en/for-contractors)
 * @param pageTitle Page title for WebSite schema (optional)
 * @param pageDescription Page description for WebSite schema (optional)
 * @returns Modified HTML with schema script
 */
export function injectSchemaOrg(html: string, pageUrl: string, pageTitle?: string, pageDescription?: string): string {
	const organization = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Garna',
		url: BASE_DOMAIN,
		description: 'Global payroll solutions and contractor payments',
	};

	const webSite = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Garna',
		url: BASE_DOMAIN,
	};

	// Add WebPage for the current page when we have title/description
	const webPage =
		pageTitle || pageDescription
			? {
					'@context': 'https://schema.org',
					'@type': 'WebPage',
					url: pageUrl,
					...(pageTitle && { name: pageTitle }),
					...(pageDescription && { description: pageDescription }),
			  }
			: null;

	const graph = webPage ? [organization, webSite, webPage] : [organization, webSite];
	const schemaScript = `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;

	// Remove existing Schema.org script if present (avoid duplicates)
	if (html.includes('application/ld+json')) {
		html = html.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\n?/gi, '');
	}

	html = html.replace('</head>', `  ${schemaScript}\n</head>`);
	return html;
}
