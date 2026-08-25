import type { BlogArticle, BlogAuthor } from './types';
import { escapeAttribute, escapeHtml, normalizePublicOrigin } from './utils';

export function metaTags(params: {
	title: string;
	description: string;
	url: string;
	image?: string | null;
	type?: string;
	noindex?: boolean;
}): string {
	const image = params.image ? absoluteUrl(params.image, params.url) : '';
	return [
		`<title>${escapeHtml(params.title)}</title>`,
		`<meta name="description" content="${escapeAttribute(params.description)}" />`,
		params.noindex ? '<meta name="robots" content="noindex,nofollow" />' : '',
		`<link rel="canonical" href="${escapeAttribute(params.url)}" />`,
		`<link rel="alternate" hreflang="en" href="${escapeAttribute(params.url)}" />`,
		`<link rel="alternate" hreflang="x-default" href="${escapeAttribute(params.url)}" />`,
		`<meta property="og:type" content="${escapeAttribute(params.type || 'website')}" />`,
		`<meta property="og:title" content="${escapeAttribute(params.title)}" />`,
		`<meta property="og:description" content="${escapeAttribute(params.description)}" />`,
		`<meta property="og:url" content="${escapeAttribute(params.url)}" />`,
		image ? `<meta property="og:image" content="${escapeAttribute(image)}" />` : '',
		'<meta name="twitter:card" content="summary_large_image" />',
	].filter(Boolean).join('\n');
}

export function articleJsonLd(article: BlogArticle, origin: string): string {
	const language = article.language || 'en';
	const url = `${origin}/${language}/blog/${article.slug}`;
	const graph = [
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: 'Garna',
			url: origin,
		},
		{
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: article.title,
			description: article.excerpt,
			url,
			mainEntityOfPage: url,
			datePublished: article.published_at || article.updated_at,
			dateModified: article.updated_at,
			author: article.author
				? {
						'@type': 'Person',
						name: article.author.name,
						url: `${origin}/${language}/blog/author/${article.author.slug}`,
				  }
				: undefined,
			image: article.og_image_url || article.cover_url ? absoluteUrl((article.og_image_url || article.cover_url) as string, origin) : undefined,
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Blog', item: `${origin}/${language}/blog` },
				{ '@type': 'ListItem', position: 2, name: article.title, item: url },
			],
		},
	];
	return `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
}

export function authorJsonLd(author: BlogAuthor, origin: string): string {
	const graph = [
		{
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: author.name,
			jobTitle: author.role || undefined,
			description: author.bio || undefined,
			url: `${origin}/en/blog/author/${author.slug}`,
			image: author.avatar_url ? absoluteUrl(author.avatar_url, origin) : undefined,
			sameAs: [author.x_url, author.linkedin_url].filter((url) => url && url !== '#'),
		},
	];
	return `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
}

export function originFromEnv(env?: { PUBLIC_ORIGIN?: string }): string {
	return normalizePublicOrigin(env);
}

function absoluteUrl(pathOrUrl: string, base: string): string {
	if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
	const origin = /^https?:\/\//i.test(base) ? new URL(base).origin : base;
	return `${origin}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}
