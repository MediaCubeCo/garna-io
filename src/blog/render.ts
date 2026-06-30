import type { BlogArticle, BlogAuthor, BlogCategory, BlogEnv } from './types';
import { articleJsonLd, authorJsonLd, metaTags, originFromEnv } from './seo';
import { escapeAttribute, escapeHtml, htmlResponse, markdownToHtml, slugify } from './utils';

type TocItem = { id: string; label: string; isIntro?: boolean };

type PageShellOptions = {
	articleChrome?: boolean;
};

function pageShell(title: string, head: string, body: string, options: PageShellOptions = {}): string {
	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	${options.articleChrome ? '<link rel="stylesheet" href="/rainbow-bg.css" />' : ''}
	${head}
	<style>
		:root { color-scheme: dark; --bg: #050505; --panel: #0a0a0a; --muted: #a1a1aa; --green: #5ea500; }
		* { box-sizing: border-box; }
		html { scroll-behavior: smooth; }
		body { margin: 0; background: var(--bg); color: white; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
		a { color: inherit; text-decoration: none; }
		.garna-blog { min-height: 100vh; background: radial-gradient(circle at 70% 0%, rgba(94,165,0,.12), transparent 32%), var(--bg); }
		.garna-blog--article { position: relative; isolation: isolate; background: var(--bg); }
		.garna-blog--article::before { content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none; background: radial-gradient(circle at 52% 0%, rgba(94,165,0,.18), transparent 34%), linear-gradient(180deg, rgba(5,5,5,.18), #050505 520px); }
		.garna-site-header { position: fixed; inset: 0 0 auto; z-index: 50; border-bottom: 1px solid rgba(255,255,255,.08); background: rgba(5,5,5,.72); backdrop-filter: blur(18px); }
		.garna-site-header-inner { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; max-width: 1180px; height: 64px; margin: 0 auto; padding: 0 24px; }
		.garna-site-logo img { display: block; width: 82px; height: auto; }
		.garna-site-nav { display: flex; gap: 36px; align-items: center; justify-content: center; color: rgba(255,255,255,.86); font-size: 16px; font-weight: 300; }
		.garna-site-actions { display: flex; gap: 8px; align-items: center; justify-content: flex-end; }
		.garna-site-button { display: inline-flex; align-items: center; justify-content: center; min-height: 42px; padding: 0 26px; border: 1px solid rgba(255,255,255,.14); border-radius: 12px; color: #fff; font-size: 15px; }
		.garna-site-button--primary { border-color: transparent; background: #5ea500; box-shadow: 0 12px 28px rgba(94,165,0,.2); }
		.garna-blog-header, .garna-blog-section { max-width: 1180px; margin: 0 auto; padding: 32px 24px; }
		.garna-blog-header { padding-top: 104px; text-align: center; }
		.garna-blog-kicker { color: var(--green); text-transform: uppercase; letter-spacing: .12em; font-size: 12px; }
		h1 { font-size: clamp(42px, 8vw, 88px); line-height: .95; font-weight: 300; letter-spacing: 0; margin: 16px auto 20px; max-width: 980px; }
		h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 350; letter-spacing: 0; margin: 0 0 18px; }
		p { color: var(--muted); line-height: 1.7; }
		.garna-blog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
		.garna-blog-card { display: flex; flex-direction: column; min-height: 100%; background: rgba(10,10,10,.9); border: 1px solid rgba(255,255,255,.09); border-radius: 8px; overflow: hidden; }
		.garna-blog-card img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; background: #111; }
		.garna-blog-card-body { padding: 22px; display: flex; flex-direction: column; gap: 12px; }
		.garna-blog-meta { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; color: #8d8d95; font-size: 13px; }
		.garna-blog-chip { color: var(--green); background: rgba(94,165,0,.1); border: 1px solid rgba(94,165,0,.22); padding: 4px 9px; border-radius: 999px; font-size: 12px; text-transform: uppercase; }
		.garna-blog-article { max-width: 820px; margin: 0 auto; padding: 0 24px 96px; }
		.garna-article-hero { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 1280px; margin: 0 auto; padding: 152px 24px 64px; }
		.garna-article-hero-copy { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 896px; text-align: center; }
		.garna-article-meta { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; justify-content: center; margin-bottom: 24px; color: #9ca3af; font-size: 14px; font-weight: 200; }
		.garna-article-dot { display: inline-block; width: 4px; height: 4px; border-radius: 999px; background: #4b5563; }
		.garna-article-clock { display: inline-flex; gap: 6px; align-items: center; }
		.garna-article-title { margin: 0 0 32px; max-width: 896px; color: #fff; font-size: clamp(36px, 5vw, 48px); line-height: 1.16; font-weight: 400; letter-spacing: 0; }
		.garna-article-excerpt { max-width: 850px; margin: 0; padding-bottom: 48px; color: #9ca3af; font-size: 18px; line-height: 1.7; font-weight: 200; }
		.garna-article-hero-bottom { display: flex; gap: 24px; align-items: center; justify-content: space-between; width: 100%; max-width: 896px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,.1); }
		.garna-article-author { display: inline-flex; gap: 16px; align-items: center; color: #fff; text-align: left; }
		.garna-article-author img { width: 56px; height: 56px; border-radius: 999px; object-fit: cover; border: 1px solid rgba(255,255,255,.2); }
		.garna-article-author strong { display: block; color: #fff; font-size: 16px; font-weight: 200; letter-spacing: 0; }
		.garna-article-author span span { display: block; margin-top: 2px; color: #9ca3af; font-size: 14px; font-weight: 100; }
		.garna-article-share { display: flex; gap: 12px; align-items: center; color: #9ca3af; font-size: 14px; font-weight: 100; }
		.garna-article-share-button { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 1px solid rgba(255,255,255,.1); border-radius: 999px; background: rgba(255,255,255,.05); color: #9ca3af; transition: color .2s ease, background .2s ease, border-color .2s ease; }
		.garna-article-share-button:hover { border-color: #5ea500; background: #5ea500; color: #fff; }
		.garna-article-cover-section { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
		.garna-article-cover { display: block; position: relative; width: 100%; min-height: 500px; margin: 0; overflow: hidden; border: 1px solid rgba(255,255,255,.05); border-radius: 24px; background: #0a0a0a; box-shadow: 0 0 15px rgba(0,0,0,.5); }
		.garna-article-cover::before { content: ""; position: absolute; left: -80px; top: -80px; z-index: 1; width: 240px; height: 240px; border-radius: 999px; background: rgba(94,165,0,.05); filter: blur(48px); transition: background .5s ease; }
		.garna-article-cover:hover::before { background: rgba(94,165,0,.15); }
		.garna-article-cover img { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; }
		.garna-article-shell { max-width: 1280px; margin: 0 auto; padding: 64px 24px 104px; }
		.garna-article-grid { display: grid; grid-template-columns: 220px minmax(0, 1fr) 220px; gap: 80px; align-items: start; justify-content: center; }
		.garna-article-main { min-width: 0; max-width: 768px; }
		.garna-blog-article-body h2, .garna-blog-article-body h3, .garna-blog-article-body h4 { scroll-margin-top: 96px; margin: 52px 0 20px; color: #f4f4f5; font-weight: 300; letter-spacing: 0; }
		.garna-blog-article-body h2 { font-size: 30px; line-height: 1.2; }
		.garna-blog-article-body h3 { font-size: 24px; line-height: 1.3; }
		.garna-blog-intro-anchor { display: block; height: 0; scroll-margin-top: 96px; }
		.garna-blog-article-body p, .garna-blog-article-body li { font-size: 20px; line-height: 1.72; color: #9ca3af; font-weight: 200; }
		.garna-blog-article-body p { margin: 0 0 24px; }
		.garna-blog-article-body ul { margin: 0 0 28px; padding-left: 24px; }
		.garna-blog-divider { width: 100%; height: 1px; margin: 36px 0; border: 0; background: rgba(255,255,255,.14); }
		.garna-article-toc { position: sticky; top: 96px; padding-top: 4px; }
		.garna-article-toc-title { margin: 0 0 18px; color: #a1a1aa; font-size: 12px; font-weight: 400; letter-spacing: .08em; text-transform: uppercase; }
		.garna-article-toc-list { display: grid; gap: 22px; margin: 0; padding: 14px 0 14px 18px; border-left: 1px solid rgba(255,255,255,.08); list-style: none; }
		.garna-article-toc-list a { display: block; color: #71717a; font-size: 16px; line-height: 1.35; font-weight: 200; transition: color .2s ease; }
		.garna-article-toc-list li:first-child { position: relative; }
		.garna-article-toc-list li:first-child::before { content: ""; position: absolute; left: -19px; top: 0; width: 2px; height: 42px; background: #5ea500; }
		.garna-article-toc-list li:first-child a, .garna-article-toc-list a:hover { color: #fff; }
		.garna-article-aside { position: sticky; top: 88px; }
		.garna-article-side-card { display: block; position: relative; width: 100%; height: 320px; overflow: hidden; border: 1px solid rgba(255,255,255,.07); border-radius: 12px; background: linear-gradient(to bottom, #1a1a1e, #151518, #0a0a0c); box-shadow: 0 18px 40px rgba(0,0,0,.35); }
		.garna-article-side-card::before { content: ""; position: absolute; inset: -30% -55% auto; height: 170px; transform: rotate(35deg); background: rgba(94,165,0,.18); filter: blur(34px); }
		.garna-article-side-card-inner { position: relative; z-index: 1; display: flex; height: 100%; flex-direction: column; align-items: center; justify-content: flex-start; padding: 24px; text-align: center; }
		.garna-article-side-card h2 { margin: 0; color: #f4f4f5; font-size: 20px; line-height: 1.22; font-weight: 300; letter-spacing: 0; }
		.garna-article-side-card h2 span { color: #5ea500; }
		.garna-article-side-visual { width: 100%; max-width: 190px; min-height: 130px; object-fit: cover; margin: 18px auto 22px; border-radius: 12px; border: 1px solid rgba(255,255,255,.1); box-shadow: 0 18px 34px rgba(0,0,0,.35); }
		.garna-article-side-button { display: inline-flex; min-height: 38px; align-items: center; justify-content: center; padding: 0 22px; border-radius: 10px; background: #5ea500; color: #fff; font-size: 14px; box-shadow: 0 0 24px rgba(94,165,0,.38); }
		.garna-article-mobile-toc { display: none; margin: 0 0 34px; padding: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 10px; background: rgba(255,255,255,.03); }
		.garna-blog-image { margin: 36px 0; }
		.garna-blog-image img { display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,.1); background: #111; }
		.garna-blog-image figcaption { margin-top: 10px; color: #8d8d95; font-size: 14px; font-style: italic; text-align: center; }
		.garna-blog-video { position: relative; margin: 40px 0; aspect-ratio: 16 / 9; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,.1); background: #111; }
		.garna-blog-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
		.garna-blog-cta { display: block; position: relative; width: 100%; height: 300px; margin: 44px 0 24px; overflow: hidden; border: 1px solid rgba(255,255,255,.05); border-radius: 12px; background: linear-gradient(to bottom, #1a1a1e, #151518, #0a0a0c); box-shadow: 0 10px 15px -3px rgba(0,0,0,.35), 0 4px 6px -4px rgba(0,0,0,.35); transition: transform .5s ease, box-shadow .5s ease, border-color .5s ease; }
		.garna-blog-cta:hover { transform: translateY(-4px); border-color: rgba(94,165,0,.3); box-shadow: 0 25px 50px -12px rgba(0,0,0,.55); }
		.garna-blog-cta-beams { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
		.garna-blog-cta-beams span { position: absolute; left: -30%; width: 160%; transform: rotate(35deg); background: rgba(94,165,0,.2); filter: blur(28px); transition: transform 1s ease; }
		.garna-blog-cta-beams span:first-child { top: 5%; height: 80px; }
		.garna-blog-cta-beams span:last-child { top: 30%; height: 96px; background: rgba(94,165,0,.1); filter: blur(48px); }
		.garna-blog-cta:hover .garna-blog-cta-beams span:first-child { transform: rotate(35deg) translateX(16px); }
		.garna-blog-cta:hover .garna-blog-cta-beams span:last-child { transform: rotate(35deg) translateX(32px); }
		.garna-blog-cta-content { position: relative; z-index: 1; display: flex; justify-content: space-between; width: 100%; height: 100%; }
		.garna-blog-cta-copy { display: flex; flex-direction: column; justify-content: center; width: 50%; padding: 32px 0 32px 32px; text-align: left; }
		.garna-blog-cta h2 { margin: 0; color: #fff; font-size: 30px; line-height: 1.1; font-weight: 400; letter-spacing: 0; }
		.garna-blog-cta p { margin: 12px 0 0; color: #9ca3af; font-size: 16px; line-height: 1.625; font-weight: 200; }
		.garna-blog-cta-copy > span { display: inline-flex; align-items: center; justify-content: center; width: max-content; min-height: 42px; margin-top: 24px; padding: 10px 24px; border-radius: 12px; background: #5ea500; color: #fff; font-size: 16px; font-weight: 400; transition: transform .3s ease; }
		.garna-blog-cta-copy > span:hover { transform: scale(1.05); }
		.garna-blog-cta-visual { position: relative; flex-grow: 1; min-height: 300px; width: 50%; }
		.garna-blog-payroll-card { position: absolute; width: 220px; overflow: hidden; border: 1px solid rgba(255,255,255,.1); border-radius: 16px; background: rgba(24,24,27,.95); box-shadow: 0 20px 40px -15px rgba(0,0,0,.7); color: #fff; transition: transform .7s ease, box-shadow .7s ease; }
		.garna-blog-cta:hover .garna-blog-payroll-card { box-shadow: 0 25px 50px -12px rgba(94,165,0,.15); }
		.garna-blog-payroll-card--green { z-index: 2; left: 32px; top: 50%; transform: translateX(40px) translateY(calc(-50% - 44px)) rotate(3deg); }
		.garna-blog-payroll-card--blue { z-index: 1; right: 24px; top: 50%; transform: translateX(-24px) translateY(-21px) rotate(-2deg); }
		.garna-blog-cta:hover .garna-blog-payroll-card--green { transform: translateX(40px) translateY(calc(-50% - 44px)) rotate(3deg) scale(1.05); }
		.garna-blog-cta:hover .garna-blog-payroll-card--blue { transform: translateX(-24px) translateY(-21px) rotate(-2deg) scale(1.05); box-shadow: 0 25px 50px -12px rgba(59,130,246,.15); }
		.garna-blog-payroll-card-main { display: grid; grid-template-columns: 40px minmax(0,1fr) auto; gap: 12px; align-items: center; padding: 16px; }
		.garna-blog-payroll-avatar { position: relative; width: 40px; height: 40px; flex-shrink: 0; }
		.garna-blog-payroll-avatar img { width: 100%; height: 100%; object-fit: cover; border: 1px solid rgba(255,255,255,.2); border-radius: 999px; background: #27272a; }
		.garna-blog-payroll-avatar span { position: absolute; right: 0; bottom: 0; width: 10px; height: 10px; border: 2px solid #18181b; border-radius: 999px; background: #5ea500; }
		.garna-blog-payroll-card--blue .garna-blog-payroll-avatar span { background: #3b82f6; }
		.garna-blog-payroll-card strong { display: block; color: #fff; font-size: 12px; line-height: 1.1; font-weight: 300; }
		.garna-blog-payroll-card small { display: block; margin-top: 2px; color: #a1a1aa; font-size: 10px; line-height: 1.1; font-weight: 200; }
		.garna-blog-payroll-amount { text-align: right; }
		.garna-blog-payroll-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 16px; border-top: 1px solid rgba(255,255,255,.06); background: rgba(255,255,255,.02); font-size: 11px; }
		.garna-blog-payroll-card-footer span { display: flex; align-items: center; gap: 8px; color: #d4d4d8; font-weight: 300; }
		.garna-blog-payroll-card-footer i { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 999px; background: rgba(94,165,0,.1); color: #5ea500; }
		.garna-blog-payroll-card--blue .garna-blog-payroll-card-footer i { background: rgba(59,130,246,.1); color: #60a5fa; }
		.garna-blog-tldr { margin: 0 0 48px; padding: 24px 32px; border: 1px solid rgba(94,165,0,.2); border-radius: 12px; background: rgba(94,165,0,.05); }
		.garna-blog-tldr h2 { display: flex; align-items: center; gap: 8px; margin: 0 0 20px; color: #fff; font-size: 20px; line-height: 1.4; font-weight: 200; letter-spacing: 0; }
		.garna-blog-tldr ul { display: flex; flex-direction: column; gap: 16px; margin: 0; padding: 0; list-style: none; color: #9ca3af; font-size: 18px; font-weight: 200; }
		.garna-blog-tldr li { display: flex; align-items: flex-start; gap: 12px; color: #9ca3af; font-size: 18px; line-height: 1.55; font-weight: 200; }
		.garna-blog-tldr li svg { flex-shrink: 0; margin-top: 8px; }
		.garna-blog-tldr li span { color: #9ca3af; }
		.garna-blog-author { display: flex; gap: 18px; align-items: center; justify-content: center; flex-wrap: wrap; margin-top: 24px; }
		.garna-blog-avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(94,165,0,.35); }
		.garna-blog-admin-link { position: fixed; right: 16px; bottom: 16px; color: #777; font-size: 12px; }
		@media (max-width: 1100px) {
			.garna-article-grid { grid-template-columns: minmax(0, 768px); justify-content: center; }
			.garna-article-toc, .garna-article-aside { display: none; }
			.garna-article-mobile-toc { display: block; }
		}
		@media (max-width: 760px) {
			.garna-site-header-inner { display: flex; justify-content: space-between; height: 60px; padding: 0 18px; }
			.garna-site-nav { display: none; }
			.garna-site-button { min-height: 38px; padding: 0 16px; font-size: 14px; }
			.garna-site-button:not(.garna-site-button--primary) { display: none; }
			.garna-article-hero { padding: 104px 18px 40px; }
			.garna-article-hero-bottom { flex-direction: column; align-items: flex-start; }
			.garna-article-share { flex-wrap: wrap; }
			.garna-article-cover-section { padding: 0 18px; }
			.garna-article-cover { min-height: 280px; border-radius: 18px; }
			.garna-article-shell { padding: 48px 18px 72px; }
			.garna-article-title { font-size: 36px; }
			.garna-article-excerpt { font-size: 18px; }
			.garna-blog-article-body p, .garna-blog-article-body li { font-size: 18px; }
		}
	</style>
</head>
<body>
	${options.articleChrome ? `${rainbowBackground()}${siteHeader()}` : ''}
	<main class="garna-blog${options.articleChrome ? ' garna-blog--article' : ''}" data-page-title="${escapeAttribute(title)}">${body}</main>
</body>
</html>`;
}

export async function renderBlogIndex(env: BlogEnv, articles: BlogArticle[], categories: BlogCategory[], language = 'en', activeCategorySlug?: string): Promise<Response> {
	const origin = originFromEnv(env);
	const activeCategory = activeCategorySlug ? categories.find((category) => category.slug === activeCategorySlug) : undefined;
	const visibleArticles = activeCategory
		? articles.filter((article) => article.categories?.some((category) => category.slug === activeCategory.slug))
		: articles;
	const head = metaTags({
		title: 'Garna Insights Hub | Global payroll and hiring insights',
		description: 'Practical guides, industry trends, and international employment updates from Garna.',
		url: `${origin}/${language}/blog`,
	});
	const astroShell = await getBlogListAstroShell(env);
	if (astroShell) {
		const [featuredArticle, ...gridArticles] = visibleArticles;
		return htmlResponse(fillBlogListAstroShell(astroShell, {
			articles: activeCategory ? visibleArticles : (gridArticles.length ? gridArticles : visibleArticles),
			categories,
			featuredArticle: activeCategory ? undefined : featuredArticle,
			headHtml: head,
			language,
			activeCategorySlug: activeCategory?.slug,
		}));
	}
	const categoryHtml = categories
		.map((category) => `<span class="garna-blog-chip">${escapeHtml(category.name)}</span>`)
		.join('');
	const cards = visibleArticles.map(renderArticleCard).join('');
	const body = `
		<header class="garna-blog-header">
			<div class="garna-blog-kicker">Garna Blog</div>
			<h1>Garna Insights Hub</h1>
			<p>Dive into expert insights on global hiring, payroll, and workforce management.</p>
			<div class="garna-blog-meta" style="justify-content:center">${categoryHtml}</div>
		</header>
		<section class="garna-blog-section">
			<div class="garna-blog-grid">${cards || '<p>No published articles yet.</p>'}</div>
		</section>`;
	return htmlResponse(pageShell('Garna Insights Hub', head, body));
}

export async function renderAuthorPage(env: BlogEnv, author: BlogAuthor, articles: BlogArticle[], language = 'en'): Promise<Response> {
	const origin = originFromEnv(env);
	const url = `${origin}/${language}/blog/author/${author.slug}`;
	const head = metaTags({
		title: `${author.name} | Garna Blog`,
		description: author.bio || `Articles by ${author.name} on the Garna blog.`,
		url,
		image: author.avatar_url,
	}) + authorJsonLd(author, origin);
	const astroShell = await getBlogAuthorAstroShell(env);
	if (astroShell) {
		return htmlResponse(fillBlogAuthorAstroShell(astroShell, {
			articles,
			author,
			headHtml: head,
			language,
		}));
	}
	const body = `
		<header class="garna-blog-header">
			${author.avatar_url ? `<img class="garna-blog-avatar" src="${escapeAttribute(author.avatar_url)}" alt="${escapeAttribute(author.avatar_alt || author.name)}" />` : ''}
			<div class="garna-blog-kicker">Author Profile</div>
			<h1>${escapeHtml(author.name)}</h1>
			<p>${escapeHtml(author.bio || '')}</p>
			<div class="garna-blog-meta" style="justify-content:center">${escapeHtml(author.role || '')}</div>
		</header>
		<section class="garna-blog-section">
			<div class="garna-blog-grid">${articles.map(renderArticleCard).join('') || '<p>No published articles yet.</p>'}</div>
		</section>`;
	return htmlResponse(pageShell(`${author.name} | Garna Blog`, head, body));
}

export async function renderArticlePage(env: BlogEnv, article: BlogArticle, relatedArticles: BlogArticle[] = [], language = article.language || 'en'): Promise<Response> {
	const origin = originFromEnv(env);
	const url = `${origin}/${language}/blog/${article.slug}`;
	const head = metaTags({
		title: article.seo_title || `${article.title} | Garna Blog`,
		description: article.seo_description || article.excerpt,
		url,
		image: article.og_image_url || article.cover_url,
		type: 'article',
	}) + articleJsonLd(article, origin);
	const categories = (article.categories || []).map((category) => `<span class="garna-blog-chip">${escapeHtml(category.name)}</span>`).join('');
	const author = article.author;
	const articleBodyMarkdown = stripLeadingArticleTitleHeading(article.body_markdown, article.title);
	const hasIntroTocItem = articleStartsWithIntro(articleBodyMarkdown);
	const tocItems = articleTableOfContents(articleBodyMarkdown, article.title, hasIntroTocItem);
	const tocHtml = renderTableOfContents(tocItems);
	const articleBodyHtml = `${hasIntroTocItem ? '<span id="intro" class="garna-blog-intro-anchor" aria-hidden="true"></span>' : ''}${markdownToHtml(articleBodyMarkdown, { headingIds: true })}`;
	const astroShell = await getArticleAstroShell(env);
	if (astroShell) {
		return htmlResponse(fillArticleAstroShell(astroShell, {
			article,
			bodyHtml: articleBodyHtml,
			afterBodyHtml: renderArticleAfterBody(article, relatedArticles, url),
			faqHtml: renderArticleFaq(article),
			categoriesHtml: renderHeroCategories(article),
			coverHtml: renderCoverBlock(article),
			desktopTocHtml: renderTableOfContentsForShell(tocItems, 'desktop'),
			headHtml: head,
			mobileTocHtml: renderTableOfContentsForShell(tocItems, 'mobile'),
			rightBannerHtml: payrollSideBanner(),
			url,
		}));
	}
	const body = `
		<section class="garna-article-hero">
			<div class="garna-article-hero-copy">
				<div class="garna-article-meta">
					${categories}
					<span class="garna-article-dot" aria-hidden="true"></span>
					<span>${escapeHtml(formatDate(article.published_at))}</span>
					<span class="garna-article-dot" aria-hidden="true"></span>
					<span class="garna-article-clock">${clockIcon()}${escapeHtml(article.read_time_minutes)} min read</span>
				</div>
				<h1 class="garna-article-title">${escapeHtml(article.title)}</h1>
				<p class="garna-article-excerpt">${escapeHtml(article.excerpt)}</p>
			</div>
			<div class="garna-article-hero-bottom">
				${author ? `<a class="garna-article-author" href="/${escapeAttribute(language)}/blog/author/${escapeAttribute(author.slug)}">
					${author.avatar_url ? `<img src="${escapeAttribute(author.avatar_url)}" alt="${escapeAttribute(author.avatar_alt || author.name)}" />` : ''}
					<span><strong>${escapeHtml(author.name)}</strong><span>${escapeHtml(author.role || '')}</span></span>
				</a>` : '<span></span>'}
				<div class="garna-article-share">
					<span>Share this article:</span>
					<a class="garna-article-share-button" href="https://x.com/intent/tweet?url=${escapeAttribute(url)}" target="_blank" rel="noopener noreferrer" aria-label="Share on X">${xIcon()}</a>
					<a class="garna-article-share-button" href="https://www.linkedin.com/sharing/share-offsite/?url=${escapeAttribute(url)}" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">${linkedInIcon()}</a>
					<a class="garna-article-share-button" href="${escapeAttribute(url)}" aria-label="Copy article link">${linkIcon()}</a>
				</div>
			</div>
		</section>
		${article.cover_url ? `<section class="garna-article-cover-section"><figure class="garna-article-cover"><img src="${escapeAttribute(article.cover_url)}" alt="${escapeAttribute(article.cover_alt || article.title)}" style="${cropStyle(article.cover_object_position, article.cover_crop_scale)}" /></figure></section>` : ''}
		<div class="garna-article-shell">
			<div class="garna-article-grid">
				${tocHtml ? `<aside class="garna-article-toc">${tocHtml}</aside>` : '<aside class="garna-article-toc"></aside>'}
				<article class="garna-article-main">
					${tocHtml ? `<nav class="garna-article-mobile-toc">${tocHtml}</nav>` : ''}
					<div class="garna-blog-article-body">${articleBodyHtml}</div>
					${renderArticleAfterBody(article, relatedArticles, url)}
				</article>
				<aside class="garna-article-aside">
					${payrollSideBanner()}
				</aside>
			</div>
		</div>
		${renderArticleFaq(article)}`;
	return htmlResponse(pageShell(article.title, head, body, { articleChrome: true }));
}

async function getArticleAstroShell(env: BlogEnv): Promise<string | null> {
	if (!env.ASSETS) return null;
	const response = await env.ASSETS.fetch(new Request('https://assets.local/blog-article-shell.html'));
	if (!response.ok) return null;
	return response.text();
}

async function getBlogListAstroShell(env: BlogEnv): Promise<string | null> {
	if (!env.ASSETS) return null;
	const response = await env.ASSETS.fetch(new Request('https://assets.local/blog-list-shell.html'));
	if (!response.ok) return null;
	return response.text();
}

async function getBlogAuthorAstroShell(env: BlogEnv): Promise<string | null> {
	if (!env.ASSETS) return null;
	const response = await env.ASSETS.fetch(new Request('https://assets.local/blog-author-shell.html'));
	if (!response.ok) return null;
	return response.text();
}

function fillBlogListAstroShell(
	template: string,
	input: {
		articles: BlogArticle[];
		categories: BlogCategory[];
		featuredArticle?: BlogArticle;
		headHtml: string;
		language: string;
		activeCategorySlug?: string;
	}
): string {
	const hasActiveCategory = Boolean(input.activeCategorySlug);
	const replacements: Record<string, string> = {
		'%%BLOG_PAGE_TITLE%%': 'Garna Insights Hub | Global payroll and hiring insights',
		'%%BLOG_PAGE_DESCRIPTION%%': 'Practical guides, industry trends, and international employment updates from Garna.',
		'%%BLOG_OG_IMAGE%%': '/pages/blog/assets/01-1e96bbb7-a5c7-4597-987a-3a820daffbff_3840w.jpg',
		'%%BLOG_DYNAMIC_HEAD%%': input.headHtml,
		'%%BLOG_CATEGORY_FILTERS%%': renderBlogCategoryFilters(input.categories, input.language, input.activeCategorySlug),
		'%%BLOG_FEATURED_ARTICLE%%': renderFeaturedArticle(input.featuredArticle, input.language),
		'%%BLOG_CTA_BLOCK%%': hasActiveCategory ? '' : renderBlogListCta(),
		'%%BLOG_ARTICLE_CARDS%%': renderArticleGridCards(input.articles),
		'%%BLOG_PAGINATION%%': renderBlogPagination(input.articles.length),
	};
	return replaceShellTokens(template, replacements)
		.replaceAll('data-current-path="blog-list-shell"', 'data-current-path="blog"')
		.replaceAll('class="garna-header-nav-link" data-nav-parent="resources"', 'class="garna-header-nav-link is-active" data-nav-parent="resources"');
}

function fillBlogAuthorAstroShell(
	template: string,
	input: {
		articles: BlogArticle[];
		author: BlogAuthor;
		headHtml: string;
		language: string;
	}
): string {
	const { author } = input;
	const replacements: Record<string, string> = {
		'%%BLOG_PAGE_TITLE%%': escapeHtml(`${author.name} | Garna Blog`),
		'%%BLOG_PAGE_DESCRIPTION%%': escapeAttribute(author.bio || `Articles by ${author.name} on the Garna blog.`),
		'%%BLOG_OG_IMAGE%%': escapeAttribute(author.avatar_url || '/pages/blog/assets/12-photo-1438761681033-6461ffad8d80.jpg'),
		'%%BLOG_DYNAMIC_HEAD%%': input.headHtml,
		'%%BLOG_AUTHOR_NAME%%': escapeHtml(author.name),
		'%%BLOG_AUTHOR_BIO%%': escapeHtml(author.bio || ''),
		'%%BLOG_AUTHOR_AVATAR%%': renderAuthorAvatar(author),
		'%%BLOG_AUTHOR_ROLE%%': escapeHtml(author.role || ''),
		'%%BLOG_AUTHOR_SOCIAL_SECTION%%': renderAuthorSocialSection(author),
		'%%BLOG_ARTICLE_CARDS%%': renderArticleGridCards(input.articles),
		'%%BLOG_PAGINATION%%': renderBlogPagination(input.articles.length),
	};
	return replaceShellTokens(template, replacements)
		.replaceAll('data-current-path="blog-author-shell"', 'data-current-path="blog-author"')
		.replaceAll('class="garna-header-nav-link" data-nav-parent="resources"', 'class="garna-header-nav-link is-active" data-nav-parent="resources"');
}

function replaceShellTokens(template: string, replacements: Record<string, string>): string {
	let html = template;
	for (const [token, value] of Object.entries(replacements)) {
		html = html.replaceAll(token, value);
	}
	return html;
}

function fillArticleAstroShell(
	template: string,
	input: {
		article: BlogArticle;
		bodyHtml: string;
		afterBodyHtml: string;
		faqHtml: string;
		categoriesHtml: string;
		coverHtml: string;
		desktopTocHtml: string;
		headHtml: string;
		mobileTocHtml: string;
		rightBannerHtml: string;
		url: string;
	}
): string {
	const { article, url } = input;
	const replacements: Record<string, string> = {
		'%%BLOG_PAGE_TITLE%%': escapeHtml(article.seo_title || `${article.title} | Garna Blog`),
		'%%BLOG_PAGE_DESCRIPTION%%': escapeAttribute(article.seo_description || article.excerpt),
		'%%BLOG_OG_IMAGE%%': escapeAttribute(article.og_image_url || article.cover_url || ''),
		'%%BLOG_DYNAMIC_HEAD%%': input.headHtml,
		'%%BLOG_CATEGORY_META%%': input.categoriesHtml,
		'%%BLOG_DATE%%': escapeHtml(formatDate(article.published_at)),
		'%%BLOG_READ_TIME%%': escapeHtml(article.read_time_minutes),
		'%%BLOG_TITLE%%': escapeHtml(article.title),
		'%%BLOG_EXCERPT%%': escapeHtml(article.excerpt),
		'%%BLOG_AUTHOR_BLOCK%%': renderAuthorHeroBlock(article),
		'%%BLOG_X_SHARE_URL%%': escapeAttribute(`https://x.com/intent/tweet?url=${encodeURIComponent(url)}`),
		'%%BLOG_LINKEDIN_SHARE_URL%%': escapeAttribute(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`),
		'%%BLOG_CANONICAL_URL%%': escapeAttribute(url),
		'%%BLOG_X_ICON%%': xIcon(),
		'%%BLOG_LINKEDIN_ICON%%': linkedInIcon(),
		'%%BLOG_LINK_ICON%%': linkIcon(),
		'%%BLOG_COVER_BLOCK%%': input.coverHtml,
		'%%BLOG_TOC_DESKTOP%%': input.desktopTocHtml,
		'%%BLOG_TOC_MOBILE%%': input.mobileTocHtml,
		'%%BLOG_ARTICLE_BODY%%': input.bodyHtml,
		'%%BLOG_ARTICLE_AFTER_BODY%%': input.afterBodyHtml,
		'%%BLOG_ARTICLE_FAQ%%': input.faqHtml,
		'%%BLOG_RIGHT_BANNER%%': input.rightBannerHtml,
	};
	let html = template;
	for (const [token, value] of Object.entries(replacements)) {
		html = html.replaceAll(token, value);
	}
	html = html
		.replaceAll('data-current-path="blog-article-shell"', 'data-current-path="blog-article"')
		.replaceAll('class="garna-header-nav-link" data-nav-parent="resources"', 'class="garna-header-nav-link is-active" data-nav-parent="resources"');
	return html;
}

function renderBlogCategoryFilters(categories: BlogCategory[], language: string, activeCategorySlug?: string): string {
	const activeClass = 'flex-shrink-0 bg-[#5ea500] text-white px-5 py-2 rounded-full text-sm hover:bg-[#4a8300] transition-colors snap-start';
	const inactiveClass = 'flex-shrink-0 text-gray-400 px-5 py-2 rounded-full text-sm hover:bg-[#5ea500]/10 hover:text-[#5ea500] transition-colors snap-start border border-transparent hover:border-[#5ea500]/20';
	const allButtonClass = activeCategorySlug ? inactiveClass : activeClass;
	const allButton = `<a href="/${escapeAttribute(language)}/blog" class="${allButtonClass}" data-blog-category-link><span>All categories</span></a>`;
	const categoryButtons = categories.map((category) => {
		const href = `/${language}/blog?category=${encodeURIComponent(category.slug)}`;
		const buttonClass = category.slug === activeCategorySlug ? activeClass : inactiveClass;
		return `<a href="${escapeAttribute(href)}" class="${buttonClass}" data-blog-category-link><span>${escapeHtml(category.name)}</span></a>`;
	}).join('');
	return allButton + categoryButtons;
}

function renderBlogListCta(): string {
	return `<section class="overflow-hidden pt-4 pb-8 relative">
		<div class="font-manrope max-w-7xl mx-auto pr-6 pl-6">
			<div class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-between rounded-3xl border border-white/10 bg-[#0a0a0a]/55 px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
				<h2 class="md:text-3xl text-2xl leading-tight font-thin text-white tracking-tight" data-translate="blog.cta.title">Your Global Growth Starts Here</h2>
				<a href="#" onclick="event.preventDefault(); if (window.GarnaWidget) window.GarnaWidget.open({ trackingCta: 'blog_demo' });" class="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-[#5ea500] px-7 text-base font-normal text-white shadow-[0_0_24px_rgba(94,165,0,0.32)] transition-transform duration-300 hover:scale-[1.03] hover:bg-[#69b800]">
					<span data-translate="blog.cta.button">Book a Demo</span>
				</a>
			</div>
		</div>
	</section>`;
}

function renderFeaturedArticle(article: BlogArticle | undefined, language: string): string {
	if (!article) return '';
	const category = article.categories?.[0]?.name || 'Insight';
	const articleLanguage = article.language || language;
	return `<section>
		<div class="max-w-7xl mx-auto pr-6 pb-16 pl-6">
			<a href="/${escapeAttribute(articleLanguage)}/blog/${escapeAttribute(article.slug)}" class="flex flex-col lg:flex-row bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden group hover:border-[#5ea500]/30 hover:-translate-y-1 transition-all duration-500 relative outline-none">
				<div class="absolute -left-20 -top-20 w-60 h-60 bg-[#5ea500]/5 rounded-full blur-3xl duration-500 pointer-events-none z-0"></div>
				<div class="p-8 lg:p-12 xl:p-16 flex flex-col justify-between w-full lg:w-[45%] relative z-10 shrink-0">
					<div>
						<span class="text-[#5ea500] text-sm font-light tracking-wide uppercase mb-6 inline-block font-manrope">${escapeHtml(category)}</span>
						<h3 class="text-3xl lg:text-4xl font-light text-white tracking-tight mb-6 font-manrope transition-colors duration-300">${escapeHtml(article.title)}</h3>
						<p class="leading-relaxed text-lg text-gray-400 font-extralight">${escapeHtml(article.excerpt)}</p>
					</div>
					<div class="mt-12 lg:mt-24">
						<span class="text-gray-500 text-sm font-extralight font-manrope">${escapeHtml(formatDate(article.published_at))}</span>
					</div>
				</div>
				<div class="w-full lg:w-[55%] relative min-h-[300px] sm:min-h-[400px] lg:min-h-0 overflow-hidden bg-[#0A0A0A]">
					${article.cover_url ? `<img src="${escapeAttribute(article.cover_url)}" alt="${escapeAttribute(article.cover_alt || article.title)}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100" style="${cropStyle(article.cover_object_position, article.cover_crop_scale)}">` : ''}
					<div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent hidden lg:block z-10"></div>
					<div class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0A0A] to-transparent lg:hidden z-10"></div>
				</div>
			</a>
		</div>
	</section>`;
}

function renderArticleGridCards(articles: BlogArticle[]): string {
	if (!articles.length) {
		return `<div class="md:col-span-2 lg:col-span-3 rounded-[20px] border border-white/5 bg-[#0c0c0c] p-10 text-center text-gray-400 font-thin">No published articles yet.</div>`;
	}
	return articles.map(renderReferenceArticleCard).join('');
}

function renderReferenceArticleCard(article: BlogArticle): string {
	const category = article.categories?.[0]?.name || 'Insight';
	const language = article.language || 'en';
	return `<a class="flex flex-col bg-[#0c0c0c] rounded-[20px] overflow-hidden border border-white/5 hover:border-[#5ea500]/50 transition-all duration-300 group cursor-pointer shadow-lg" href="/${escapeAttribute(language)}/blog/${escapeAttribute(article.slug)}">
		<div class="p-2 pb-0">
			<div class="h-56 w-full overflow-hidden bg-[#0A0A0A] rounded-2xl">
				${article.cover_url ? `<img src="${escapeAttribute(article.cover_url)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" alt="${escapeAttribute(article.cover_alt || article.title)}" loading="lazy" style="${cropStyle(article.related_object_position || article.cover_object_position, article.related_crop_scale || article.cover_crop_scale)}">` : ''}
			</div>
		</div>
		<div class="p-8 flex flex-col flex-1">
			<div class="text-sm font-thin text-gray-400 mb-4 flex items-center gap-2">
				<span class="text-[#5ea500] font-thin">${escapeHtml(category)}</span>
				<span class="w-1 h-1 rounded-full bg-[#5ea500]/50"></span>
				<span>${escapeHtml(formatDate(article.published_at))}</span>
			</div>
			<h3 class="text-xl font-thin text-white tracking-tight mb-3 leading-[1.4] group-hover:text-[#5ea500] transition-colors duration-300">${escapeHtml(article.title)}</h3>
			<p class="text-base text-gray-400 font-thin leading-relaxed">${escapeHtml(article.excerpt)}</p>
		</div>
	</a>`;
}

function renderBlogPagination(articleCount: number): string {
	if (articleCount <= 9) return '';
	return `<div class="lg:mt-16 flex gap-1.5 sm:gap-2 mt-12 gap-x-1.5 gap-y-1.5 items-center justify-center">
		<button class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-white/5 bg-[#0c0c0c] text-gray-400 hover:text-[#5ea500] hover:border-[#5ea500]/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#5ea500]/10" aria-label="Previous Page">${chevronLeftIcon()}</button>
		<button class="sm:w-10 sm:h-10 flex transition-all duration-300 shadow-[#5ea500]/20 text-sm font-thin text-[#5ea500] bg-[#0c0c0c] w-8 h-8 border-[#5ea500] border rounded-full items-center justify-center" aria-label="Page 1" aria-current="page">1</button>
		<button class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-white/5 bg-[#0c0c0c] text-gray-400 hover:text-[#5ea500] hover:border-[#5ea500]/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#5ea500]/10" aria-label="Next Page">${chevronRightIcon()}</button>
	</div>`;
}

function renderAuthorAvatar(author: BlogAuthor): string {
	if (author.avatar_url) {
		return `<img src="${escapeAttribute(author.avatar_url)}" alt="${escapeAttribute(author.avatar_alt || author.name)}" class="w-full h-full rounded-full object-cover" style="${cropStyle(author.avatar_object_position, author.avatar_crop_scale)}">`;
	}
	return `<span class="w-full h-full rounded-full flex items-center justify-center bg-[#0A0A0A] text-white text-4xl font-light">${escapeHtml(author.name.slice(0, 1).toUpperCase())}</span>`;
}

function renderAuthorSocialSection(author: BlogAuthor): string {
	const links = renderAuthorSocialLinks(author);
	if (!links) return '';
	return `<div class="flex flex-col sm:flex-row sm:gap-12 w-full border-white/10 border-t pt-8 gap-x-8 gap-y-8 items-center justify-center">
		<div class="flex items-center gap-4">${links}</div>
	</div>`;
}

function renderAuthorSocialLinks(author: BlogAuthor): string {
	const links = [
		usableSocialValue(author.x_url) ? socialIconLink(author.x_url!, 'X Profile', xIcon(), true) : '',
		usableSocialValue(author.linkedin_url) ? socialIconLink(author.linkedin_url!, 'LinkedIn Profile', linkedInIcon(), true) : '',
		usableSocialValue(author.email) ? socialIconLink(`mailto:${author.email}`, 'Email', mailIcon()) : '',
	];
	return links.filter(Boolean).join('');
}

function usableSocialValue(value: string | null | undefined): boolean {
	const normalized = value?.trim();
	return Boolean(normalized && normalized !== '#');
}

function socialIconLink(href: string, label: string, icon: string, external = false): string {
	const externalAttributes = external ? ' target="_blank" rel="noopener noreferrer"' : '';
	return `<a href="${escapeAttribute(href)}" aria-label="${escapeAttribute(label)}"${externalAttributes} class="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#5ea500] hover:border-[#5ea500] transition-all duration-300">${icon}</a>`;
}

function renderHeroCategories(article: BlogArticle): string {
	const categories = article.categories?.length ? article.categories : [];
	const category = categories[0];
	return `<span class="text-[#5ea500] text-xs font-light uppercase tracking-wider bg-[#5ea500]/10 px-3 py-1 rounded-full border border-[#5ea500]/20">${escapeHtml(category?.name || 'payroll')}</span>`;
}

function renderAuthorHeroBlock(article: BlogArticle): string {
	const author = article.author;
	if (!author) return '<span></span>';
	const language = article.language || 'en';
	return `<a class="flex items-center gap-4 text-left" href="/${escapeAttribute(language)}/blog/author/${escapeAttribute(author.slug)}">
		${author.avatar_url ? `<img src="${escapeAttribute(author.avatar_url)}" alt="${escapeAttribute(author.avatar_alt || author.name)}" class="w-14 h-14 rounded-full border border-white/20 object-cover" />` : ''}
		<div>
			<p class="text-white text-base font-extralight font-manrope tracking-tight">${escapeHtml(author.name)}</p>
			<p class="text-gray-400 text-sm font-thin font-manrope">${escapeHtml(author.role || '')}</p>
		</div>
	</a>`;
}

function renderCoverBlock(article: BlogArticle): string {
	if (!article.cover_url) return '';
	return `<section>
		<div class="garna-container">
			<figure class="flex flex-col bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] relative outline-none min-h-[250px] sm:min-h-[300px] lg:min-h-[500px]">
				<div class="absolute -left-20 -top-20 w-60 h-60 bg-[#5ea500]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
				<div class="absolute inset-0 w-full h-full z-0 bg-[#0A0A0A]">
					<img src="${escapeAttribute(article.cover_url)}" alt="${escapeAttribute(article.cover_alt || article.title)}" class="absolute inset-0 w-full h-full object-cover" style="${cropStyle(article.cover_object_position, article.cover_crop_scale)}" />
				</div>
			</figure>
		</div>
	</section>`;
}

function renderArticleAfterBody(article: BlogArticle, relatedArticles: BlogArticle[], url: string): string {
	return [
		renderArticleFooter(article, url),
		renderRelatedArticles(relatedArticles),
	].filter(Boolean).join('');
}

function renderArticleFooter(article: BlogArticle, url: string): string {
	const writtenBy = article.author?.name || 'Garna';
	return `<div class="garna-blog-article-footer">
		<div class="garna-blog-article-footer-meta">
			<div>${calendarIcon()}<span>Last updated: ${escapeHtml(formatDate(article.updated_at || article.published_at))}</span></div>
			<div>${userCheckIcon()}<span>Written by: ${escapeHtml(writtenBy)}</span></div>
		</div>
		<div class="garna-blog-article-footer-share">
			<a class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#5ea500] hover:border-[#5ea500] transition-all cursor-pointer" href="https://x.com/intent/tweet?url=${escapeAttribute(encodeURIComponent(url))}" target="_blank" rel="noopener noreferrer" aria-label="Share on X">${xIcon()}</a>
			<a class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#5ea500] hover:border-[#5ea500] transition-all cursor-pointer" href="https://www.linkedin.com/sharing/share-offsite/?url=${escapeAttribute(encodeURIComponent(url))}" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">${linkedInIcon()}</a>
			<button type="button" class="garna-blog-copy-link w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#5ea500] hover:border-[#5ea500] transition-all cursor-pointer" data-copy-url="${escapeAttribute(url)}" aria-label="Copy article link">${linkIcon()}</button>
		</div>
	</div>`;
}

function renderRelatedArticles(articles: BlogArticle[]): string {
	const cards = articles.slice(0, 3).map((article) => ({
		language: article.language || 'en',
		slug: article.slug,
		title: article.title,
		cover_url: article.cover_url,
		cover_alt: article.cover_alt || article.title,
		related_object_position: article.related_object_position || article.cover_object_position || '50% 50%',
		related_crop_scale: article.related_crop_scale || article.cover_crop_scale || 1,
	}));
	if (!cards.length) return '';
	return `<div class="garna-blog-related">
		<h3>Related Articles</h3>
		<div class="garna-blog-related-grid">
			${cards.map((article) => `<a class="garna-blog-related-card" href="/${escapeAttribute(article.language)}/blog/${escapeAttribute(article.slug)}">
				${article.cover_url ? `<div class="garna-blog-related-image"><img src="${escapeAttribute(article.cover_url)}" alt="${escapeAttribute(article.cover_alt || article.title)}" loading="lazy" style="${cropStyle(article.related_object_position, article.related_crop_scale)}" /></div>` : ''}
				<h4>${escapeHtml(article.title)}</h4>
			</a>`).join('')}
		</div>
	</div>`;
}

function renderArticleFaq(article: BlogArticle): string {
	const faqs = article.faqs || [];
	if (!faqs.length) return '';
	return `<section class="garna-blog-faq-section" data-faq-section data-faq-variant="standard">
		<div class="garna-container">
			<div class="garna-blog-faq-layout">
				<div class="garna-blog-faq-copy">
					<h2>Frequently Asked Questions</h2>
					<p class="garna-blog-faq-subtitle">Can't find the answer you're looking for? Reach out to our team.</p>
					<a class="garna-blog-faq-contact" href="/en#contact">
						<span>Contact Team</span>
						${arrowRightIcon()}
					</a>
				</div>
				<div class="garna-blog-faq-list" data-faq-accordion>
					${faqs.map((faq) => `<details class="group bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden hover:border-[#5ea500]/30 transition-colors duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]" data-faq-item data-state="closed">
						<summary class="flex items-center justify-between p-6 cursor-pointer text-white font-medium outline-none">
							<span class="text-lg font-light">${escapeHtml(faq.question)}</span>
							<span class="transition-transform duration-300 text-white/50 flex-shrink-0 ml-4 bg-white/5 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#5ea500]/10">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="garna-faq-icon" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
							</span>
						</summary>
						<div class="garna-faq-panel">
							<div class="leading-relaxed font-thin text-gray-400 pr-6 pb-6 pl-6"><p>${escapeHtml(faq.answer)}</p></div>
						</div>
					</details>`).join('')}
				</div>
			</div>
		</div>
	</section>`;
}

function renderTableOfContentsForShell(items: TocItem[], variant: 'desktop' | 'mobile'): string {
	if (!items.length) return '';
	const hasIntro = Boolean(items[0]?.isIntro);
	const links = items
		.map((item, index) => {
			const label = `${hasIntro ? index : index + 1}. ${escapeHtml(item.label)}`;
			if (variant === 'mobile') {
				return `<li><a href="#${escapeAttribute(item.id)}" data-heading-id="${escapeAttribute(item.id)}" class="garna-blog-toc-link hover:text-[#5ea500] transition-colors">${label}</a></li>`;
			}
			return `<li><a href="#${escapeAttribute(item.id)}" data-heading-id="${escapeAttribute(item.id)}" class="garna-blog-toc-link ${index === 0 ? 'is-active' : ''}">${label}</a></li>`;
		})
		.join('');
	if (variant === 'mobile') {
		return `<nav class="garna-blog-toc garna-blog-toc--mobile" data-blog-toc><h3 class="text-white text-xs font-extralight uppercase tracking-widest mb-4 flex items-center gap-2">${listIcon()}Table of Contents</h3><ul class="flex flex-col text-base text-gray-400 font-thin gap-3">${links}</ul></nav>`;
	}
	return `<nav class="garna-blog-toc" data-blog-toc><h3 class="uppercase text-xs font-thin text-white tracking-widest mb-5">Table of Contents</h3><div class="garna-blog-toc-track"><span class="garna-blog-toc-marker" aria-hidden="true"></span><ol class="garna-blog-toc-list">${links}</ol></div></nav>`;
}

function siteHeader(): string {
	return `<header class="garna-site-header">
		<div class="garna-site-header-inner">
			<a class="garna-site-logo" href="/en" aria-label="Garna home"><img src="/garna_logo.svg" alt="Garna" /></a>
			<nav class="garna-site-nav" aria-label="Primary navigation">
				<a href="/en">Products</a>
				<a href="/en">Solutions</a>
				<a href="/en/blog">Blog</a>
			</nav>
			<div class="garna-site-actions">
				<a class="garna-site-button" href="https://app.garna.io/auth/sign-in">Log In</a>
				<a class="garna-site-button garna-site-button--primary" href="https://app.garna.io/auth/sign-up">Sign Up</a>
			</div>
		</div>
	</header>`;
}

function rainbowBackground(): string {
	return `<div class="rainbow-bg" data-rainbow-bg aria-hidden="true">
		<div class="rainbow-bg__parallax">
			${Array.from({ length: 25 }, () => '<div class="rainbow"></div>').join('')}
			<div class="h"></div>
			<div class="v"></div>
		</div>
	</div>`;
}

function articleTableOfContents(markdown: string, articleTitle: string, includeIntro = false): TocItem[] {
	const headings = markdown
		.replace(/\r\n/g, '\n')
		.split('\n')
		.map((line) => {
			const match = line.trim().match(/^(#{1,2})\s+(.+)$/);
			return match ? { level: match[1].length, label: stripInlineMarkdown(match[2]) } : null;
		})
		.filter((value): value is { level: number; label: string } => Boolean(value?.label));
	const articleTitleKey = slugify(articleTitle);
	const sectionHeadings = headings.filter((heading) => slugify(heading.label) !== articleTitleKey);
	const primary = sectionHeadings.filter((heading) => heading.level === 1);
	const fallback = sectionHeadings.filter((heading) => heading.level === 2);
	const selected = primary.length ? primary : fallback;
	const used = new Map<string, number>();
	const items = selected.map((heading) => ({ id: uniqueTocId(heading.label, used), label: heading.label }));
	return includeIntro ? [{ id: 'intro', label: 'Intro', isIntro: true }, ...items] : items;
}

function stripLeadingArticleTitleHeading(markdown: string, articleTitle: string): string {
	const normalizedTitle = slugify(articleTitle);
	const lines = markdown.replace(/\r\n/g, '\n').split('\n');
	const headingIndex = lines.findIndex((line) => line.trim().length > 0);
	if (headingIndex < 0) return markdown;

	const match = lines[headingIndex].trim().match(/^#{1,2}\s+(.+)$/);
	if (!match || slugify(stripInlineMarkdown(match[1])) !== normalizedTitle) return markdown;

	lines.splice(headingIndex, 1);
	while (lines[headingIndex]?.trim() === '') lines.splice(headingIndex, 1);
	return lines.join('\n').trimStart();
}

function articleStartsWithIntro(markdown: string): boolean {
	const firstContentLine = markdown
		.replace(/\r\n/g, '\n')
		.split('\n')
		.find((line) => line.trim().length > 0);
	if (!firstContentLine) return false;
	return !/^#{1,2}\s+.+$/.test(firstContentLine.trim());
}

function renderTableOfContents(items: TocItem[]): string {
	if (!items.length) return '';
	const hasIntro = Boolean(items[0]?.isIntro);
	return `<p class="garna-article-toc-title">Table of contents</p>
		<ol class="garna-article-toc-list">
			${items.map((item, index) => `<li><a href="#${escapeAttribute(item.id)}">${hasIntro ? index : index + 1}. ${escapeHtml(item.label)}</a></li>`).join('')}
		</ol>`;
}

function uniqueTocId(label: string, used: Map<string, number>): string {
	const base = slugify(label) || 'section';
	const count = used.get(base) || 0;
	used.set(base, count + 1);
	return count ? `${base}-${count + 1}` : base;
}

function stripInlineMarkdown(value: string): string {
	return value
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[*_`~]/g, '')
		.trim();
}

function payrollSideBanner(): string {
	return `<a href="https://garna.io/" target="_blank" rel="noopener noreferrer" class="block overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-[#5ea500]/30 bg-gradient-to-b from-[#1a1a1e] via-[#151518] to-[#0a0a0c] w-full h-[320px] border-white/5 border rounded-xl mb-6 relative shadow-lg">
		<div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
			<div class="absolute top-[5%] left-[-30%] w-[160%] h-20 bg-[#5ea500]/20 rotate-[35deg] blur-2xl transform-gpu transition-transform duration-1000 group-hover:translate-x-4"></div>
			<div class="absolute top-[30%] left-[-30%] w-[160%] h-24 bg-[#5ea500]/10 rotate-[35deg] blur-3xl transform-gpu transition-transform duration-1000 group-hover:translate-x-8"></div>
		</div>
		<div class="flex flex-col w-full h-full z-10 pt-6 pr-6 pb-6 pl-6 relative items-center justify-start">
			<div class="text-center mb-auto pb-4">
				<h2 class="leading-[1.15] text-2xl lg:text-xl text-white tracking-tight font-thin xl:text-xl">See Global Payroll<br><span class="font-normal text-[#5ea500]">in Action</span></h2>
			</div>
			<div class="flex group-hover:-translate-y-1 transition-transform duration-500 w-full h-full max-w-[190px] z-20 mb-6 relative items-center justify-center">
				<div class="absolute inset-0 bg-[#5ea500] blur-[16px] opacity-15 rounded-full group-hover:opacity-25 transition-all duration-700 mix-blend-screen"></div>
				<div class="flex flex-col transition-all duration-500 group-hover:border-[#5ea500]/30 group-hover:shadow-[0_8px_25px_rgba(94,165,0,0.1)] overflow-hidden bg-center w-full h-full bg-[url(/pages/blog/assets/21-f0f31e7a-67b4-4cbd-918d-d607080ee39f_3840w.png)] bg-cover z-20 border-white/10 border rounded-xl relative shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
					<div class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#5ea500]/50 to-transparent opacity-40"></div>
				</div>
			</div>
			<div class="group/btn z-20 mt-auto relative">
				<div class="absolute -inset-0.5 bg-gradient-to-r from-[#5ea500] to-[#3a6600] rounded-full blur opacity-30 group-hover/btn:opacity-70 transition duration-500"></div>
				<span class="flex transition-all duration-300 hover:scale-105 text-sm font-normal text-white tracking-wide bg-[#5ea500] rounded-xl pt-2.5 pr-6 pb-2.5 pl-6 relative shadow-sm gap-x-2 gap-y-2 items-center justify-center">Book a Demo</span>
			</div>
			<div class="absolute top-0 right-0 w-40 h-40 bg-[#5ea500]/5 rounded-full blur-3xl z-0 pointer-events-none transition-opacity duration-700 group-hover:bg-[#5ea500]/10"></div>
		</div>
	</a>`;
}

function listIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"></line></svg>';
}

function clockIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
}

function calendarIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>';
}

function userCheckIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>';
}

function arrowRightIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
}

function xIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>';
}

function linkedInIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>';
}

function linkIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
}

function mailIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>';
}

function chevronLeftIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>';
}

function chevronRightIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>';
}

function renderArticleCard(article: BlogArticle): string {
	const category = article.categories?.[0];
	const language = article.language || 'en';
	return `<a class="garna-blog-card" href="/${escapeAttribute(language)}/blog/${escapeAttribute(article.slug)}">
		${article.cover_url ? `<img src="${escapeAttribute(article.cover_url)}" alt="${escapeAttribute(article.cover_alt || article.title)}" style="${cropStyle(article.related_object_position || article.cover_object_position, article.related_crop_scale || article.cover_crop_scale)}" />` : ''}
		<div class="garna-blog-card-body">
			<div class="garna-blog-meta">
				${category ? `<span class="garna-blog-chip">${escapeHtml(category.name)}</span>` : ''}
				<span>${escapeHtml(formatDate(article.published_at))}</span>
			</div>
			<h2>${escapeHtml(article.title)}</h2>
			<p>${escapeHtml(article.excerpt)}</p>
			<div class="garna-blog-meta">${escapeHtml(article.author?.name || '')}</div>
		</div>
	</a>`;
}

function cropStyle(position?: string | null, scale?: number | null): string {
	const candidate = position || '';
	const safePosition = /^(-?\d{1,4}(?:\.\d+)?)%\s+(-?\d{1,4}(?:\.\d+)?)%$/.test(candidate) ? candidate : '50% 50%';
	const numericScale = Number(scale);
	const safeScale = Number.isFinite(numericScale) ? Math.min(3, Math.max(1, numericScale)) : 1;
	return `object-position: ${escapeAttribute(safePosition)}; transform: scale(${safeScale}); transform-origin: ${escapeAttribute(safePosition)}`;
}

function formatDate(date: string | null): string {
	if (!date) return '';
	return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(date));
}
