import { createBlog, type BlogEnv } from '@mediacubeco/blog-engine';
import { languages } from '../config/languages';
import { injectHtmlLangTag } from '../utils/htmlLang';
import { injectPageTranslations } from '../utils/page-translations';
import type { RouteInfo } from '../utils/routes';

const BLOG_LOCALES = ['en', 'es', 'pt', 'ru'] as const;

const BLOG_DESCRIPTION =
	'Discover expert articles, practical guides, industry trends, and compliance updates on global employment. Hire, pay, and manage international teams with ease.';

const BLOG_INTRODUCTION =
	'Dive into the world of expert insights on global hiring, payroll, and workforce management and stay one step ahead. Check out our practical guides, industry trends, and international employment updates';

export function handleLegacyBlogRedirect(request: Request): Response | null {
	const url = new URL(request.url);
	if (url.pathname === '/en/blog-article' || url.pathname === '/blog-article') {
		return Response.redirect(new URL('/en/blog/global-payroll-complexity', url.origin), 301);
	}
	if (url.pathname === '/en/blog-author' || url.pathname === '/blog-author') {
		return Response.redirect(new URL('/en/blog/author/emily-chen', url.origin), 301);
	}
	return null;
}

export function isGarnaBlogPath(pathname: string): boolean {
	if (/^\/(?:en|es|pt|ru)\/blog(?:\/|$)/.test(pathname)) return true;
	return ['/admin/blog', '/admin/api/blog', '/admin/api/auth', '/blog-media', '/blog-assets'].some(
		(base) => pathname === base || pathname.startsWith(`${base}/`),
	);
}

export function createGarnaBlog(request: Request, env: BlogEnv) {
	const url = new URL(request.url);
	const requestLanguage = BLOG_LOCALES.find((locale) => locale === url.pathname.split('/')[1]) || 'en';
	const origin = configuredOrigin(request, env);

	return createBlog({
		brand: {
			name: 'Garna',
			title: 'Garna Insights Hub',
			introduction: BLOG_INTRODUCTION,
			description: BLOG_DESCRIPTION,
			seoTitle: 'Global Hiring & Payroll Insights | Garna Blog',
			image: '/pages/blog/assets/01-1e96bbb7-a5c7-4597-987a-3a820daffbff_3840w.jpg',
		},
		origin,
		locales: languages.map((language) => ({ label: language.label, value: language.value })),
		defaultLanguage: 'en',
		defaultCategoryLabel: 'Insight',
		cookieName: 'garna_blog_session',
		theme: {
			'--blog-accent': '#CBF300',
			'--blog-background': '#101010',
			'--blog-foreground': '#f7f7f7',
			'--blog-muted': '#a1a1aa',
			'--blog-font': 'Manrope, sans-serif',
		},
		cta: {
			href: `${origin}/${requestLanguage}`,
			title: 'Your Global Growth Starts Here',
			text: 'See how Garna runs global payroll, hiring, and compliance in one place.',
			button: 'Book a Demo',
		},
		slots: {
			listCta: () => listCta(),
			sideBanner: () => payrollSideBanner(),
			contact: () => contactLink(),
		},
		renderShell: (page, bindings) => renderGarnaBlogShell(page, bindings, url),
	});
}

function configuredOrigin(request: Request, env: BlogEnv): string {
	const candidate = env.PUBLIC_ORIGIN?.trim();
	if (candidate) return new URL(candidate).origin;
	return new URL(request.url).origin;
}

async function renderGarnaBlogShell(
	page: { title: string; head: string; body: string; language: string },
	bindings: BlogEnv,
	url: URL,
): Promise<string> {
	if (!bindings.ASSETS) {
		return `<!doctype html><html lang="${page.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${page.head}</head><body>${page.body}</body></html>`;
	}

	const shellResponse = await bindings.ASSETS.fetch(new Request('https://assets.local/blog-list-shell.html'));
	if (!shellResponse.ok) throw new Error('Garna blog shell is unavailable');

	const isPlainIndex = /^\/(?:en|es|pt|ru)\/blog$/.test(url.pathname.replace(/\/$/, '')) && !url.searchParams.get('category');
	const engineHead = isPlainIndex ? withoutIndexSeo(page.head) : page.head;
	let html = (await shellResponse.text())
		.replace('%%BLOG_DYNAMIC_HEAD%%', engineHead)
		.replace('%%BLOG_ENGINE_BODY%%', page.body)
		.replace(/data-current-path="[^"]*"/, 'data-current-path="blog"');

	html = injectHtmlLangTag(html, page.language);
	const routeInfo: RouteInfo = {
		locale: page.language,
		language: page.language,
		region: null,
		pathSegments: ['blog'],
		isValid: true,
		query: '',
		hash: '',
	};
	html = injectPageTranslations(html, 'blog', routeInfo, new URL(url.origin).origin, bindings);
	if (!isPlainIndex) html = restoreEngineDocumentSeo(html, page.head);
	html = applyLanguageAlternates(html, page.head);
	return html;
}

function withoutIndexSeo(head: string): string {
	return head
		.replace(/<title>[\s\S]*?<\/title>/gi, '')
		.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi, '')
		.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi, '')
		.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi, '')
		.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/gi, '')
		.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/gi, '');
}

function restoreEngineDocumentSeo(html: string, engineHead: string): string {
	const title = engineHead.match(/<title>[\s\S]*?<\/title>/i)?.[0];
	const description = engineHead.match(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i)?.[0];
	const ogTitle = engineHead.match(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i)?.[0];
	const ogDescription = engineHead.match(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i)?.[0];
	const ogImage = engineHead.match(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i)?.[0];
	const titleText = title?.replace(/<\/?title>/gi, '') || '';

	const keepFirst = (source: string, pattern: RegExp, replacement?: string) => {
		if (!replacement) return source;
		let seen = false;
		return source.replace(pattern, () => {
			if (seen) return '';
			seen = true;
			return replacement;
		});
	};

	let next = html;
	if (title) {
		let seen = false;
		next = next.replace(/<title>[\s\S]*?<\/title>/gi, () => {
			if (seen) return '';
			seen = true;
			return title;
		});
	}
	next = keepFirst(next, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi, description);
	next = keepFirst(next, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi, ogTitle);
	next = keepFirst(next, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi, ogDescription);
	next = keepFirst(next, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/gi, ogImage);
	if (titleText) {
		next = next.replace(
			/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
			`<meta name="twitter:title" content="${titleText}">`,
		);
		const descriptionText = description?.match(/content="([^"]*)"/i)?.[1];
		if (descriptionText) {
			next = next.replace(
				/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
				`<meta name="twitter:description" content="${descriptionText}">`,
			);
		}
	}
	return next;
}

function applyLanguageAlternates(html: string, engineHead: string): string {
	const alternates = new Map<string, string>();
	for (const match of engineHead.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/?>/gi)) {
		alternates.set(match[1], match[2]);
	}
	return html.replace(/href="\/(en|es|pt|ru)\/blog"/g, (full, language: string) => {
		const alternate = alternates.get(language);
		if (!alternate) return full;
		try {
			const target = new URL(alternate);
			return `href="${target.pathname}${target.search}"`;
		} catch {
			return full;
		}
	});
}

function listCta(): string {
	return `<section class="overflow-hidden pt-4 pb-8 relative">
		<div class="font-manrope max-w-7xl mx-auto pr-6 pl-6">
			<a href="#" onclick="event.preventDefault(); if (window.GarnaWidget) window.GarnaWidget.open({ trackingCta: 'blog_demo' });" class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-between rounded-3xl border border-white/10 bg-[#0a0a0a]/55 px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition-colors hover:border-[#CBF300]/30">
				<h2 class="md:text-3xl text-2xl leading-tight font-thin text-white tracking-tight" data-translate="blog.cta.title">Your Global Growth Starts Here</h2>
				<span class="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-[#CBF300] px-7 text-base font-normal text-[#101010] shadow-[0_0_24px_rgba(203,243,0,0.32)] transition-transform duration-300 hover:scale-[1.03] hover:bg-[#D8FF33]">
					<span data-translate="blog.cta.button">Book a Demo</span>
				</span>
			</a>
		</div>
	</section>`;
}

function payrollSideBanner(): string {
	return `<a href="#" onclick="event.preventDefault(); if (window.GarnaWidget) window.GarnaWidget.open({ trackingCta: 'blog_article_side_banner_demo' });" class="block overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-[#CBF300]/30 bg-gradient-to-b from-[#1a1a1e] via-[#151518] to-[#0a0a0c] w-full h-[320px] border-white/5 border rounded-xl mb-6 relative shadow-lg">
		<div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
			<div class="absolute top-[5%] left-[-30%] w-[160%] h-20 bg-[#CBF300]/20 rotate-[35deg] blur-2xl transform-gpu transition-transform duration-1000 group-hover:translate-x-4"></div>
			<div class="absolute top-[30%] left-[-30%] w-[160%] h-24 bg-[#CBF300]/10 rotate-[35deg] blur-3xl transform-gpu transition-transform duration-1000 group-hover:translate-x-8"></div>
		</div>
		<div class="flex flex-col w-full h-full z-10 pt-6 pr-6 pb-6 pl-6 relative items-center justify-start">
			<div class="text-center mb-auto pb-4">
				<h2 class="leading-[1.15] text-2xl lg:text-xl text-white tracking-tight font-thin xl:text-xl">See Global Payroll<br><span class="font-normal text-[#CBF300]">in Action</span></h2>
			</div>
			<div class="flex group-hover:-translate-y-1 transition-transform duration-500 w-full h-full max-w-[190px] z-20 mb-6 relative items-center justify-center">
				<div class="absolute inset-0 bg-[#CBF300] blur-[16px] opacity-15 rounded-full group-hover:opacity-25 transition-all duration-700 mix-blend-screen"></div>
				<div class="flex flex-col transition-all duration-500 group-hover:border-[#CBF300]/30 group-hover:shadow-[0_8px_25px_rgba(203,243,0,0.1)] overflow-hidden bg-center w-full h-full bg-[url(/pages/blog/assets/21-f0f31e7a-67b4-4cbd-918d-d607080ee39f_3840w.png)] bg-cover z-20 border-white/10 border rounded-xl relative shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
					<div class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#CBF300]/50 to-transparent opacity-40"></div>
				</div>
			</div>
			<div class="group/btn z-20 mt-auto relative">
				<div class="absolute -inset-0.5 bg-gradient-to-r from-[#CBF300] to-[#829A00] rounded-full blur opacity-30 group-hover/btn:opacity-70 transition duration-500"></div>
				<span class="flex transition-all duration-300 hover:scale-105 text-sm font-normal text-[#101010] tracking-wide bg-[#CBF300] rounded-xl pt-2.5 pr-6 pb-2.5 pl-6 relative shadow-sm gap-x-2 gap-y-2 items-center justify-center">Book a Demo</span>
			</div>
			<div class="absolute top-0 right-0 w-40 h-40 bg-[#CBF300]/5 rounded-full blur-3xl z-0 pointer-events-none transition-opacity duration-700 group-hover:bg-[#CBF300]/10"></div>
		</div>
	</a>`;
}

function contactLink(): string {
	return `<a class="garna-blog-faq-contact" href="#" onclick="event.preventDefault(); if (window.GarnaWidget) window.GarnaWidget.open({ trackingCta: 'blog_article_faq_contact' });"><span>Contact Team</span></a>`;
}
