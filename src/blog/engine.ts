import { createBlog, escapeAttribute, type BlogEnv } from '@mediacubeco/blog-engine';
import { languages } from '../config/languages';
import { renderBlogListCta, payrollSideBanner, renderInlineCta } from './brand';

export function garnaBlog(env: BlogEnv) {
  if (!env.PUBLIC_ORIGIN) throw new Error('Garna PUBLIC_ORIGIN is required');
  return createBlog({
    brand: { name: 'Garna', title: 'Garna Insights Hub', seoTitle: 'Garna Insights Hub | Global payroll and hiring insights', description: 'Practical guides, industry trends, and international employment updates from Garna.', introduction: 'Dive into the world of expert insights on global hiring, payroll, and workforce management and stay one step ahead. Check out our practical guides, industry trends, and international employment updates', image: '/pages/blog/assets/01-1e96bbb7-a5c7-4597-987a-3a820daffbff_3840w.jpg' },
    origin: env.PUBLIC_ORIGIN,
    locales: languages,
    defaultLanguage: 'en',
    cookieName: 'garna_blog_session',
    defaultCategoryLabel: 'payroll',
    cta: { href: 'https://garna.io/', title: 'Modern Payroll for Global Teams', text: 'Manage payroll and contractor payouts in 150+ countries with local currencies, cards, wallets, and crypto', button: 'Explore Payroll' },
    slots: { listCta: renderBlogListCta, sideBanner: payrollSideBanner, inlineCta: renderInlineCta, contact: () => `<a class="garna-blog-faq-contact" href="#" onclick="event.preventDefault(); if (window.GarnaWidget) window.GarnaWidget.open({ trackingCta: 'blog_article_faq_contact' });"><span>Contact Team</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>` },
    async renderShell(page, bindings) {
      if (!bindings.ASSETS) throw new Error('Garna ASSETS binding is required');
      const response = await bindings.ASSETS.fetch(new Request('https://assets.local/blog-article-shell.html'));
      if (!response.ok) throw new Error('Garna blog shell is missing');
      let shell = await response.text();
      const tracking = page.head.includes('property="og:type" content="article"') ? 'blog-article' : 'blog';
      shell = shell.replaceAll('"trackingSource":"blog"', `"trackingSource":"${tracking}"`).replaceAll('"trackingPage":"blog"', `"trackingPage":"${tracking}"`);
      shell = shell.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta\b[^>]*(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, '');
      // Insert content last: tokens in article text must never be interpreted as shell directives.
      return shell.replace('%%BLOG_DYNAMIC_HEAD%%', page.head)
        .replace('lang="en"', `lang="${escapeAttribute(page.language)}"`)
        .replaceAll('data-current-path="blog-article-shell"', 'data-current-path="blog"')
        .replaceAll('class="garna-header-nav-link" data-nav-parent="resources"', 'class="garna-header-nav-link is-active" data-nav-parent="resources"')
        .replaceAll('__GARNA_LOCALE__', JSON.stringify(page.language))
        .replaceAll('__GARNA_WIDGET_TRANSLATIONS__', '{}')
        .replace('%%BLOG_PACKAGE_BODY%%', page.body);
    },
  });
}
