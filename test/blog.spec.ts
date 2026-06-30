import { describe, expect, it } from 'vitest';
import { isAllowedAdminEmail } from '../src/blog/auth';
import { articleJsonLd, metaTags } from '../src/blog/seo';
import type { BlogArticle } from '../src/blog/types';
import { markdownToHtml, slugify } from '../src/blog/utils';

describe('Blog utilities', () => {
	it('slugifies titles for SEO URLs', () => {
		expect(slugify('Global Payroll: 5 Rules for 2026')).toBe('global-payroll-5-rules-for-2026');
	});

	it('renders a safe markdown subset', () => {
		const html = markdownToHtml('# Title\n\nHello **team**\n\n- One\n- Two');
		expect(html).toContain('<h2>Title</h2>');
		expect(html).toContain('<strong>team</strong>');
		expect(html).toContain('<ul>');
		expect(html).toContain('<li>One</li>');
	});

	it('renders markdown dividers as horizontal rules', () => {
		const html = markdownToHtml('Before\n\n---\n\nAfter');
		expect(html).toContain('<hr class="garna-blog-divider" />');
		expect(html).not.toContain('<p>---</p>');
	});

	it('renders rich blog blocks for images, YouTube, and CTA', () => {
		const html = markdownToHtml('![Cover alt](/blog-media/cover.jpg)\n\n{{youtube:https://www.youtube.com/watch?v=dQw4w9WgXcQ}}\n\n{{cta:{"title":"Hire globally","text":"Run payroll in one place.","button":"Book a demo","url":"https://garna.io/"}}}\n\n{{tldr:{"title":"TLDR","items":["First takeaway","Second takeaway"]}}}');
		expect(html).toContain('class="garna-blog-image"');
		expect(html).toContain('src="/blog-media/cover.jpg"');
		expect(html).toContain('<figcaption>Cover alt</figcaption>');
		expect(html).toContain('https://www.youtube.com/embed/dQw4w9WgXcQ');
		expect(html).toContain('class="garna-blog-cta"');
		expect(html).toContain('Book a demo');
		expect(html).toContain('class="garna-blog-tldr"');
		expect(html).toContain('First takeaway');
	});

	it('checks admin allowlist exactly', () => {
		expect(isAllowedAdminEmail({ ADMIN_EMAILS: 'editor@garna.io, admin@garna.io' }, 'admin@garna.io')).toBe(true);
		expect(isAllowedAdminEmail({ ADMIN_EMAILS: 'editor@garna.io' }, 'other@garna.io')).toBe(false);
		expect(isAllowedAdminEmail({ ADMIN_EMAILS: '' }, 'admin@garna.io')).toBe(false);
	});
});

describe('Blog SEO', () => {
	it('generates canonical and hreflang tags for English-only v1', () => {
		const html = metaTags({
			title: 'Blog title',
			description: 'Blog description',
			url: 'https://garna.io/en/blog/example',
		});
		expect(html).toContain('<link rel="canonical" href="https://garna.io/en/blog/example" />');
		expect(html).toContain('hreflang="en"');
		expect(html).toContain('hreflang="x-default"');
	});

	it('generates Article JSON-LD with author and image', () => {
		const article: BlogArticle = {
			id: 1,
			slug: 'global-payroll',
			title: 'Global payroll',
			excerpt: 'Payroll guide',
			body_markdown: 'Body',
			status: 'published',
			author_id: 1,
			cover_url: '/cover.jpg',
			cover_alt: 'Cover',
			read_time_minutes: 5,
			seo_title: null,
			seo_description: null,
			og_image_url: null,
			canonical_path: null,
			published_at: '2026-06-25T00:00:00.000Z',
			updated_at: '2026-06-25T00:00:00.000Z',
			author: {
				id: 1,
				slug: 'emily-chen',
				name: 'Emily Chen',
				role: null,
				bio: null,
				avatar_url: null,
				avatar_alt: null,
				email: null,
				x_url: null,
				linkedin_url: null,
			},
		};
		const jsonLd = articleJsonLd(article, 'https://garna.io');
		expect(jsonLd).toContain('"@type":"Article"');
		expect(jsonLd).toContain('"url":"https://garna.io/en/blog/global-payroll"');
		expect(jsonLd).toContain('"name":"Emily Chen"');
	});
});
