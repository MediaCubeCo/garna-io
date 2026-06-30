import { getAuthorBySlug, getPublishedArticleBySlug, listCategories, listPublishedArticles, listPublishedArticlesByAuthor } from './data';
import { renderArticlePage, renderAuthorPage, renderBlogIndex } from './render';
import type { BlogEnv } from './types';
import { notFound, redirect } from './utils';
import { isSupportedLanguage } from '../config/languages';

export async function handleBlogPublic(request: Request, env: BlogEnv): Promise<Response | null> {
	const url = new URL(request.url);
	if (request.method !== 'GET' && request.method !== 'HEAD') return null;

	const segments = url.pathname.split('/').filter(Boolean);
	if (!isSupportedLanguage(segments[0] || '') || segments[1] !== 'blog') return null;
	const language = segments[0];

	if (segments.length === 2) {
		const [articles, categories] = await Promise.all([listPublishedArticles(env, 50, language), listCategories(env)]);
		const categorySlug = url.searchParams.get('category') || undefined;
		return renderBlogIndex(env, articles, categories, language, categorySlug);
	}

	if (segments.length === 3) {
		const [article, articles] = await Promise.all([getPublishedArticleBySlug(env, segments[2], language), listPublishedArticles(env, 50, language)]);
		const relatedArticles = article ? articles.filter((item) => item.id !== article.id).slice(0, 3) : [];
		return article ? await renderArticlePage(env, article, relatedArticles, language) : notFound('Article not found');
	}

	if (segments.length === 4 && segments[2] === 'author') {
		const author = await getAuthorBySlug(env, segments[3], language);
		if (!author) return notFound('Author not found');
		const articles = await listPublishedArticlesByAuthor(env, author.slug, language);
		return renderAuthorPage(env, author, articles, language);
	}

	return null;
}

export function handleLegacyBlogRedirect(request: Request): Response | null {
	const url = new URL(request.url);
	if (url.pathname === '/en/blog-article' || url.pathname === '/blog-article') {
		return redirect('/en/blog/global-payroll-complexity', 301);
	}
	if (url.pathname === '/en/blog-author' || url.pathname === '/blog-author') {
		return redirect('/en/blog/author/emily-chen', 301);
	}
	return null;
}

export async function handleBlogMedia(request: Request, env: BlogEnv): Promise<Response | null> {
	const url = new URL(request.url);
	if (!url.pathname.startsWith('/blog-media/')) return null;
	if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
	if (!env.BLOG_MEDIA) return new Response('R2 binding is required', { status: 500 });

	const key = decodeURIComponent(url.pathname.replace(/^\/blog-media\//, ''));
	if (!key || key.includes('..') || !key.startsWith('blog/')) return notFound('Media not found');
	const object = await env.BLOG_MEDIA.get(key);
	if (!object) return notFound('Media not found');

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set('etag', object.httpEtag);
	headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	return new Response(request.method === 'HEAD' ? null : object.body, { headers });
}
