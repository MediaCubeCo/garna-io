import { describe, expect, it } from 'vitest';
import { garnaBlog } from '../src/blog/engine';
import { renderInlineCta } from '../src/blog/brand';
import { handleLegacyBlogRedirect } from '../src/blog/public';
import type { BlogEnv } from '@mediacubeco/blog-engine';

describe('Packaged blog integration', () => {
  const env = {
    PUBLIC_ORIGIN: 'https://garna.io',
    DB: { prepare() { return { bind() { return this; }, async all() { return { results: [] }; } }; } },
    ASSETS: { async fetch() { return new Response('<!doctype html><html lang="en"><head><title>old title</title><meta name="description" content="old">%%BLOG_DYNAMIC_HEAD%%</head><body><header>Garna header</header><main>%%BLOG_PACKAGE_BODY%%</main><footer>Garna footer</footer></body></html>'); } },
  } as unknown as BlogEnv;

  it('renders package content inside the site shell with one set of SEO tags', async () => {
    const response = await garnaBlog(env).handle(new Request('https://garna.io/en/blog'), env);
    expect(response?.status).toBe(200);
    const html = await response!.text();
    expect(html).toContain('Garna header');
    expect(html).toContain('Garna footer');
    expect(html).toContain('Garna Insights Hub');
    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html.match(/name="description"/g)).toHaveLength(1);
    expect(html).not.toContain('%%BLOG_PACKAGE_BODY%%');
    expect(html).toContain('https://garna.io/en/blog');
  });

  it('does not claim unrelated site routes', async () => {
    expect(await garnaBlog(env).handle(new Request('https://garna.io/en/eor'), env)).toBeNull();
  });

  it('retains the branded CTA and escapes editor-provided strings', () => {
    const html = renderInlineCta({ title: '<script>bad</script>', text: 'Description', button: 'Book a demo' });
    expect(html).toContain('window.GarnaWidget');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>bad');
  });

  it('preserves legacy redirects outside the package', () => {
    expect(handleLegacyBlogRedirect(new Request('https://garna.io/blog-article'))?.headers.get('Location')).toBe('/en/blog/global-payroll-complexity');
    expect(handleLegacyBlogRedirect(new Request('https://garna.io/en/blog'))).toBeNull();
  });
});
