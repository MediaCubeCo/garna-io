import { describe, expect, it } from 'vitest';
import { markdownToHtml, slugify } from '@mediacubeco/blog-engine';
import { handleLegacyBlogRedirect, isGarnaBlogPath } from '../src/blog/site';

describe('Blog utilities', () => {
	it('slugifies titles for SEO URLs', () => {
		expect(slugify('Global Payroll: 5 Rules for 2026')).toBe('global-payroll-5-rules-for-2026');
	});

	it('renders a safe markdown subset', () => {
		const html = markdownToHtml('# Title\n\nHello **team**, *reader*, [open Garna](https://garna.io/)\n\n- One\n- Two');
		expect(html).toContain('<h2>Title</h2>');
		expect(html).toContain('<strong>team</strong>');
		expect(html).toContain('<em>reader</em>');
		expect(html).toContain('<a href="https://garna.io/" rel="noopener noreferrer" target="_blank">open Garna</a>');
		expect(html).toContain('<ul>');
		expect(html).toContain('<li>One</li>');
	});

	it('renders ordered and checklist markdown distinctly', () => {
		const html = markdownToHtml('1. First\n2. Second\n\n- [x] Done\n- [ ] Waiting');
		expect(html).toContain('<ol>');
		expect(html).toContain('<li>First</li>');
		expect(html).toContain('<ul class="garna-blog-checklist">');
		expect(html).toContain('<span class="garna-blog-checklist-box" aria-hidden="true">✓</span>');
		expect(html).toContain('<span class="garna-blog-checklist-box" aria-hidden="true"></span>');
	});

	it('renders markdown dividers as horizontal rules', () => {
		const html = markdownToHtml('Before\n\n---\n\nAfter');
		expect(html).toContain('<hr class="garna-blog-divider" />');
		expect(html).not.toContain('<p>---</p>');
	});

	it('normalizes pasted non-breaking spaces in article text', () => {
		const html = markdownToHtml('Use systems such as&nbsp;EFTPS.\n\nKeep A\u00a0B and C&#160;D readable.');
		expect(html).toContain('such as EFTPS');
		expect(html).toContain('A B');
		expect(html).toContain('C D');
		expect(html).not.toContain('&amp;nbsp;');
		expect(html).not.toContain('&nbsp;');
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
});

describe('Garna blog routing', () => {
	it('keeps the public, admin, media, and asset prefixes on the worker', () => {
		expect(isGarnaBlogPath('/en/blog')).toBe(true);
		expect(isGarnaBlogPath('/ru/blog/global-payroll-complexity')).toBe(true);
		expect(isGarnaBlogPath('/admin/blog/login')).toBe(true);
		expect(isGarnaBlogPath('/blog-media/blog/cover.jpg')).toBe(true);
		expect(isGarnaBlogPath('/blog-assets/1.4.7/public.css')).toBe(true);
		expect(isGarnaBlogPath('/en/employer-of-record')).toBe(false);
	});

	it('redirects the legacy static blog URLs', () => {
		const article = handleLegacyBlogRedirect(new Request('https://garna.io/en/blog-article'));
		const author = handleLegacyBlogRedirect(new Request('https://garna.io/blog-author'));
		expect(article?.status).toBe(301);
		expect(article?.headers.get('Location')).toBe('https://garna.io/en/blog/global-payroll-complexity');
		expect(author?.headers.get('Location')).toBe('https://garna.io/en/blog/author/emily-chen');
		expect(handleLegacyBlogRedirect(new Request('https://garna.io/en/blog'))).toBeNull();
	});
});
