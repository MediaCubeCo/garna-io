import { clearSessionCookie, consumeMagicLink, createMagicLink, createSession, getSession, isAllowedAdminEmail } from './auth';
import { getArticleById, getArticleTranslationDraft, getAuthorById, getAuthorTranslationDraft, listArticlesForAdmin, listAuthors, listCategories, listMediaAssets, upsertArticle, upsertArticleTranslation, upsertAuthor, upsertAuthorTranslation, upsertCategory } from './data';
import type { BlogArticle, BlogArticleInput, BlogAuthor, BlogEnv } from './types';
import { escapeAttribute, escapeHtml, htmlResponse, jsonResponse, normalizePublicOrigin, redirect, slugify } from './utils';
import { isSupportedLanguage, languages } from '../config/languages';

export async function handleBlogAdmin(request: Request, env: BlogEnv): Promise<Response | null> {
	const url = new URL(request.url);
	if (!url.pathname.startsWith('/admin/blog') && !url.pathname.startsWith('/admin/api/blog') && !url.pathname.startsWith('/admin/api/auth')) {
		return null;
	}

	if (url.pathname === '/admin/blog/login' && request.method === 'GET') return renderLogin();
	if (url.pathname === '/admin/api/auth/request-link' && request.method === 'POST') return requestMagicLink(request, env);
	if (url.pathname === '/admin/blog/callback' && request.method === 'GET') return consumeLoginCallback(request, env);
	if (url.pathname === '/admin/blog/logout') {
		return new Response(null, { status: 302, headers: { Location: '/admin/blog/login', 'Set-Cookie': clearSessionCookie() } });
	}

	const session = await getSession(request, env);
	if (!session) {
		if (url.pathname.startsWith('/admin/api/')) return jsonResponse({ error: 'Unauthorized' }, { status: 401 });
		return redirect('/admin/blog/login');
	}

	if (url.pathname === '/admin/blog' && request.method === 'GET') return renderArticles(env, session.email);
	if (url.pathname === '/admin/blog/authors' && request.method === 'GET') return renderAuthors(env, session.email);
	if (url.pathname === '/admin/blog/categories' && request.method === 'GET') return renderCategories(env, session.email);
	if (url.pathname === '/admin/blog/media' && request.method === 'GET') return renderMedia(env, session.email);
	if (url.pathname === '/admin/blog/design-preview' && request.method === 'GET') return renderDesignPreviewIndex(session.email);
	if (url.pathname.startsWith('/admin/blog/design-preview/') && request.method === 'GET') return renderDesignPreview(request, env);
	if (url.pathname === '/admin/blog/articles/new' && request.method === 'GET') return renderArticleForm(env, session.email);
	if (url.pathname === '/admin/blog/authors/new' && request.method === 'GET') return renderAuthorForm(env, session.email);
	if (url.pathname === '/admin/blog/categories/new' && request.method === 'GET') return renderCategoryForm(session.email);
	if (url.pathname === '/admin/blog/media/new' && request.method === 'GET') return renderMediaForm(session.email);
	if (url.pathname.match(/^\/admin\/blog\/articles\/\d+$/) && request.method === 'GET') {
		const id = Number(url.pathname.split('/').pop());
		const language = normalizeArticleLanguage(url.searchParams.get('lang') || 'en');
		const article = await getArticleById(env, id, language);
		return article ? renderArticleForm(env, session.email, article, { justSaved: url.searchParams.get('saved') === '1' }) : htmlResponse('Not found', { status: 404 });
	}
	if (url.pathname.match(/^\/admin\/blog\/authors\/\d+$/) && request.method === 'GET') {
		const id = Number(url.pathname.split('/').pop());
		const language = normalizeArticleLanguage(url.searchParams.get('lang') || 'en');
		const author = await getAuthorById(env, id, language);
		return author ? renderAuthorForm(env, session.email, author, { language, justSaved: url.searchParams.get('saved') === '1' }) : htmlResponse('Not found', { status: 404 });
	}
	if (url.pathname === '/admin/api/blog/articles' && request.method === 'POST') return saveArticle(request, env);
	if (url.pathname.match(/^\/admin\/api\/blog\/articles\/\d+$/) && request.method === 'POST') {
		const id = Number(url.pathname.split('/').pop());
		return saveArticle(request, env, id);
	}
	if (url.pathname === '/admin/api/blog/authors' && request.method === 'POST') return saveAuthor(request, env);
	if (url.pathname.match(/^\/admin\/api\/blog\/authors\/\d+$/) && request.method === 'POST') {
		const id = Number(url.pathname.split('/').pop());
		return saveAuthor(request, env, id);
	}
	if (url.pathname === '/admin/api/blog/categories' && request.method === 'POST') return saveCategory(request, env);
	if (url.pathname === '/admin/api/blog/media' && request.method === 'POST') return uploadMedia(request, env);
	if (url.pathname.match(/^\/admin\/api\/blog\/media\/\d+$/) && request.method === 'POST') {
		const id = Number(url.pathname.split('/').pop());
		return updateMedia(request, env, id);
	}

	return htmlResponse('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
}

function renderLogin(): Response {
	return adminHtml('Login', `<section class="panel narrow">
		<h1>Blog admin</h1>
		<p>Enter an approved admin email to receive a magic link.</p>
		<form method="post" action="/admin/api/auth/request-link">
			<label>Email<input name="email" type="email" required autocomplete="email" /></label>
			<button type="submit">Send magic link</button>
		</form>
	</section>`);
}

function safeJson(value: unknown): string {
	return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/'/g, '\\u0027');
}

function trashIcon(): string {
	return '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function normalizeArticleLanguage(value: string): string {
	return isSupportedLanguage(value) ? value : 'en';
}

function toDatetimeLocalValue(value: string): string {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	const offsetMs = date.getTimezoneOffset() * 60_000;
	return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function parseDatetimeLocal(value: string): string | null {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeObjectPosition(value: string): string | null {
	const match = value.match(/^(-?\d{1,4}(?:\.\d+)?)%\s+(-?\d{1,4}(?:\.\d+)?)%$/);
	if (!match) return null;
	const x = Math.min(300, Math.max(-200, Number(match[1])));
	const y = Math.min(300, Math.max(-200, Number(match[2])));
	return `${x}% ${y}%`;
}

function normalizeCropScale(value: string): number | null {
	const scale = Number(value);
	if (!Number.isFinite(scale)) return null;
	return Math.min(3, Math.max(1, scale));
}

function cropStyle(position?: string | null, scale?: number | null): string {
	const objectPosition = position || '50% 50%';
	const cropScale = scale || 1;
	return `object-position: ${escapeAttribute(objectPosition)}; transform: scale(${escapeAttribute(String(cropScale))}); transform-origin: ${escapeAttribute(objectPosition)};`;
}

async function requestMagicLink(request: Request, env: BlogEnv): Promise<Response> {
	const form = await request.formData();
	const email = String(form.get('email') || '').trim().toLowerCase();
	if (!email || !isAllowedAdminEmail(env, email)) {
		return adminHtml('Check your email', '<section class="panel narrow"><h1>Check your email</h1><p>If this address has access, a login link has been sent.</p></section>');
	}
	const useDevMagicLink = shouldShowDevMagicLink(request, env);
	const origin = useDevMagicLink ? new URL(request.url).origin : normalizePublicOrigin(env);
	const magicLink = await createMagicLink(env, email, origin);
	if (useDevMagicLink) {
		return adminHtml('Local magic link', `<section class="panel narrow">
			<h1>Local magic link</h1>
			<p class="muted">Dev-only login shortcut. This is enabled only for localhost.</p>
			<a class="button standalone" href="${escapeAttribute(magicLink)}">Open magic link</a>
		</section>`);
	}
	if (!env.EMAIL) throw new Error('EMAIL binding is required');
	await env.EMAIL.send({
		to: email,
		from: { email: env.EMAIL_FROM || 'noreply@garna.io', name: 'Garna Blog' },
		subject: 'Your Garna blog login link',
		html: `<p>Use this secure link to access Garna blog admin:</p><p><a href="${escapeAttribute(magicLink)}">Open admin</a></p><p>This link expires in 15 minutes.</p>`,
		text: `Use this secure link to access Garna blog admin: ${magicLink}\n\nThis link expires in 15 minutes.`,
	});
	return adminHtml('Check your email', '<section class="panel narrow"><h1>Check your email</h1><p>If this address has access, a login link has been sent.</p></section>');
}

function shouldShowDevMagicLink(request: Request, env: BlogEnv): boolean {
	if (env.DEV_SHOW_MAGIC_LINK !== 'true') return false;
	const hostname = new URL(request.url).hostname;
	return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

async function consumeLoginCallback(request: Request, env: BlogEnv): Promise<Response> {
	const token = new URL(request.url).searchParams.get('token') || '';
	const email = token ? await consumeMagicLink(env, token) : null;
	if (!email || !isAllowedAdminEmail(env, email)) return redirect('/admin/blog/login');
	const session = await createSession(env, email);
	return new Response(null, { status: 302, headers: { Location: '/admin/blog', 'Set-Cookie': session.cookie } });
}

async function renderArticles(env: BlogEnv, email: string): Promise<Response> {
	const articles = await listArticlesForAdmin(env);
	const articleRows = articles.map((article) => `<tr>
		<td><a class="row-link" href="/admin/blog/articles/${article.id}">${escapeHtml(article.title)}</a><span>${escapeHtml(article.slug)}</span></td>
		<td><span class="status ${article.status}">${escapeHtml(article.status)}</span></td>
		<td>${escapeHtml(article.author?.name || '')}</td>
		<td>${article.published_at ? escapeHtml(new Date(article.published_at).toLocaleDateString('en-US')) : 'Not published'}</td>
		<td><a class="text-link" href="/en/blog/${escapeAttribute(article.slug)}" target="_blank">View</a></td>
	</tr>`).join('');
	const content = `<section class="page-head">
			<div><p class="eyebrow">Blog admin</p><h1>Articles</h1></div>
			<p>${articles.length} total</p>
		</section>
		<section class="surface">
			<table><thead><tr><th>Title</th><th>Status</th><th>Author</th><th>Published</th><th>Public</th></tr></thead><tbody>${articleRows || '<tr><td colspan="5">No articles yet.</td></tr>'}</tbody></table>
		</section>`;
	return adminShell('Articles', 'articles', email, content);
}

async function renderAuthors(env: BlogEnv, email: string): Promise<Response> {
	const authors = await listAuthors(env);
	const rows = authors.map((author) => `<tr>
		<td><a class="row-link" href="/admin/blog/authors/${author.id}">${escapeHtml(author.name)}</a><span>${escapeHtml(author.slug)}</span></td>
		<td>${escapeHtml(author.role || '')}</td>
		<td>${escapeHtml(author.email || '')}</td>
		<td><a class="text-link" href="/en/blog/author/${escapeAttribute(author.slug)}" target="_blank">View</a></td>
	</tr>`).join('');
	return adminShell('Authors', 'authors', email, `<section class="page-head">
		<div><p class="eyebrow">People</p><h1>Authors</h1></div><p>${authors.length} total</p>
	</section><section class="surface"><table><thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Public</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No authors yet.</td></tr>'}</tbody></table></section>`);
}

async function renderCategories(env: BlogEnv, email: string): Promise<Response> {
	const categories = await listCategories(env);
	const rows = categories.map((category) => `<tr>
		<td><strong>${escapeHtml(category.name)}</strong><span>${escapeHtml(category.slug)}</span></td>
		<td>${escapeHtml(category.description || '')}</td>
	</tr>`).join('');
	return adminShell('Categories', 'categories', email, `<section class="page-head">
		<div><p class="eyebrow">Taxonomy</p><h1>Categories</h1></div><p>${categories.length} total</p>
	</section><section class="surface"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody>${rows || '<tr><td colspan="2">No categories yet.</td></tr>'}</tbody></table></section>`);
}

async function renderMedia(env: BlogEnv, email: string): Promise<Response> {
	const media = await listMediaAssets(env);
	const rows = media.map((asset) => `<tr>
		<td><a class="row-link" href="${escapeAttribute(asset.url)}" target="_blank">${escapeHtml(asset.key)}</a><span>${escapeHtml(asset.alt || 'No alt text')}</span></td>
		<td>${escapeHtml(asset.content_type || '')}</td>
		<td>${asset.size_bytes ? `${Math.round(asset.size_bytes / 1024)} KB` : ''}</td>
		<td>${escapeHtml(new Date(asset.created_at).toLocaleDateString('en-US'))}</td>
	</tr>`).join('');
	return adminShell('Media', 'media', email, `<section class="page-head">
		<div><p class="eyebrow">Assets</p><h1>Media</h1></div><p>${media.length} files</p>
	</section><section class="surface"><table><thead><tr><th>File</th><th>Type</th><th>Size</th><th>Uploaded</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No media yet.</td></tr>'}</tbody></table></section>`);
}

function renderDesignPreviewIndex(email: string): Response {
	return adminShell('Design preview', 'preview', email, `<section class="page-head">
		<div><p class="eyebrow">Legacy designs</p><h1>Blog design preview</h1></div>
	</section>
	<section class="surface preview-list">
		<a href="/admin/blog/design-preview/list" target="_blank"><strong>Article list</strong><span>Original static blog listing page</span></a>
		<a href="/admin/blog/design-preview/author" target="_blank"><strong>Author page</strong><span>Original static author profile page</span></a>
		<a href="/admin/blog/design-preview/article" target="_blank"><strong>Article page</strong><span>Original static article detail page</span></a>
	</section>`);
}

async function renderDesignPreview(request: Request, env: BlogEnv): Promise<Response> {
	if (!env.ASSETS) return htmlResponse('Static assets binding is not available', { status: 500, headers: { 'Cache-Control': 'no-store' } });
	const slug = new URL(request.url).pathname.split('/').pop() || '';
	const assetBySlug: Record<string, string> = {
		list: '/en/blog.html',
		author: '/en/blog-author.html',
		article: '/en/blog-article.html',
	};
	const assetPath = assetBySlug[slug];
	if (!assetPath) return htmlResponse('Preview not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
	const assetRequest = new Request(new URL(assetPath, request.url).toString(), { method: 'GET' });
	const response = await env.ASSETS.fetch(assetRequest);
	if (!response.ok) return htmlResponse('Preview asset not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
	const html = await response.text();
	return htmlResponse(html.replace(/<head>/i, '<head><meta name="robots" content="noindex,nofollow" />'), {
		headers: { 'Cache-Control': 'no-store' },
	});
}

async function renderArticleForm(env: BlogEnv, email: string, article?: any, options: { justSaved?: boolean } = {}): Promise<Response> {
	const [authors, categories, mediaAssets] = await Promise.all([listAuthors(env), listCategories(env), listMediaAssets(env)]);
	const action = article ? `/admin/api/blog/articles/${article.id}` : '/admin/api/blog/articles';
	const articleLanguage = normalizeArticleLanguage(article?.language || 'en');
	const baseArticle = article?.id && articleLanguage !== 'en' ? await getArticleById(env, article.id, 'en') : article;
	const translationDraftEntries = article?.id
		? await Promise.all(languages
			.filter((language) => language.value !== 'en')
			.map(async (language) => [language.value, await getArticleTranslationDraft(env, article.id, language.value)] as const))
		: [];
	const translationDrafts = new Map(translationDraftEntries);
	const activeTranslationDraft = article?.id && articleLanguage !== 'en' ? translationDrafts.get(articleLanguage) || null : null;
	const placeholderArticle = baseArticle || article;
	if (article && articleLanguage !== 'en') {
		article = {
			...article,
			language: articleLanguage,
			title: activeTranslationDraft?.title || '',
			excerpt: activeTranslationDraft?.excerpt || '',
			body_markdown: activeTranslationDraft?.body_markdown || '',
			cover_url: activeTranslationDraft?.cover_url || null,
			cover_alt: activeTranslationDraft?.cover_alt || null,
			cover_object_position: activeTranslationDraft?.cover_object_position || placeholderArticle?.cover_object_position || null,
			related_object_position: activeTranslationDraft?.related_object_position || placeholderArticle?.related_object_position || placeholderArticle?.cover_object_position || null,
			cover_crop_scale: activeTranslationDraft?.cover_crop_scale || placeholderArticle?.cover_crop_scale || null,
			related_crop_scale: activeTranslationDraft?.related_crop_scale || placeholderArticle?.related_crop_scale || placeholderArticle?.cover_crop_scale || null,
			seo_title: activeTranslationDraft?.seo_title || null,
			seo_description: activeTranslationDraft?.seo_description || null,
			og_image_url: activeTranslationDraft?.og_image_url || null,
			faqs: activeTranslationDraft?.faqs || [],
		};
	}
	const isTranslationModeForForm = articleLanguage !== 'en';
	const authorOptions = authors.map((author) => `<option value="${author.id}" ${article?.author_id === author.id ? 'selected' : ''}>${escapeHtml(author.name)}</option>`).join('');
	const selectedCategories = new Set((article?.categories || []).map((category: any) => category.id));
	const categoryChecks = categories.map((category) => `<label class="check"><input type="checkbox" name="category_ids" value="${category.id}" ${selectedCategories.has(category.id) ? 'checked' : ''} ${isTranslationModeForForm ? 'disabled' : ''} /> ${escapeHtml(category.name)}</label>`).join('');
	const hasCurrentMedia = mediaAssets.some((asset) => asset.url === article?.cover_url);
	const selectedCoverAsset = mediaAssets.find((asset) => asset.url === article?.cover_url);
	const selectedOgAsset = mediaAssets.find((asset) => asset.url === article?.og_image_url);
	const selectedCoverId = selectedCoverAsset ? String(selectedCoverAsset.id) : article?.cover_url && !hasCurrentMedia ? 'current' : '';
	const mediaPayload = safeJson(mediaAssets.map((asset) => ({
		id: asset.id,
		key: asset.key,
		url: asset.url,
		display_name: asset.display_name || '',
		alt: asset.alt || '',
		content_type: asset.content_type || '',
	})));
	const coverName = selectedCoverAsset?.display_name || selectedCoverAsset?.alt || selectedCoverAsset?.key || article?.cover_alt || '';
	const ogName = selectedOgAsset?.display_name || selectedOgAsset?.alt || selectedOgAsset?.key || article?.og_image_url || '';
	const seoTitleEnabled = Boolean(article?.seo_title);
	const seoDescriptionEnabled = Boolean(article?.seo_description);
	const ogImageEnabled = Boolean(article?.og_image_url);
	const articleStatus = article?.status === 'published' ? 'published' : 'draft';
	const languageSwitch = languages.map((language) => {
		const active = language.value === articleLanguage;
		const href = article?.id ? `/admin/blog/articles/${article.id}${language.value === 'en' ? '' : `?lang=${encodeURIComponent(language.value)}`}` : '#';
		const progress = language.value === 'en' || !placeholderArticle ? '' : `<small>${translationCompletionPercent(placeholderArticle, translationDrafts.get(language.value) || null)}%</small>`;
		return `<a class="language-option ${active ? 'active' : ''} ${article?.id ? '' : 'is-disabled'}" title="${escapeAttribute(language.label)}" href="${escapeAttribute(href)}" ${active ? 'aria-current="true"' : ''}><span>${escapeHtml(language.value.toUpperCase())}</span>${progress}</a>`;
	}).join('');
	const viewHref = article?.slug ? `/${articleLanguage}/blog/${escapeAttribute(article.slug)}` : '#';
	const publishAction = articleStatus === 'published' ? 'unpublish' : 'publish';
	const publishLabel = articleStatus === 'published' ? 'Unpublish' : 'Publish';
	const lockedAttribute = isTranslationModeForForm ? 'disabled' : '';
	const lockedGroupClass = isTranslationModeForForm ? ' is-locked' : '';
	const baseFaqs = placeholderArticle?.faqs || [];
	const faqs = article?.faqs?.length ? article.faqs : [{ question: '', answer: '' }, { question: '', answer: '' }, { question: '', answer: '' }];
	const faqFields = faqs.map((faq: any, index: number) => `<div class="faq-fields">
		<div class="faq-fields-head"><strong>FAQ item ${index + 1}</strong><button type="button" class="secondary faq-remove" data-faq-remove>Remove</button></div>
		<label>Question<input name="faq_question[]" value="${escapeAttribute(faq.question || '')}" placeholder="${escapeAttribute(isTranslationModeForForm ? baseFaqs[index]?.question || '' : '')}" /></label>
		<label>Answer<textarea name="faq_answer[]" placeholder="${escapeAttribute(isTranslationModeForForm ? baseFaqs[index]?.answer || '' : '')}">${escapeHtml(faq.answer || '')}</textarea></label>
	</div>`).join('');
	return adminShell(article ? 'Edit article' : 'New article', 'articles', email, `<form id="article-form" class="article-compose" method="post" enctype="multipart/form-data" action="${action}">
				<input type="hidden" name="language" value="${escapeAttribute(articleLanguage)}" />
				${isTranslationModeForForm ? `<input type="hidden" name="slug" value="${escapeAttribute(article?.slug || '')}" />
				<input type="hidden" name="author_id" value="${escapeAttribute(article?.author_id || '')}" />
				<input type="hidden" name="published_at" value="${escapeAttribute(toDatetimeLocalValue(article?.published_at || ''))}" />
				<input type="hidden" name="status" value="${articleStatus}" />
				${Array.from(selectedCategories).map((categoryId) => `<input type="hidden" name="category_ids" value="${escapeAttribute(categoryId)}" />`).join('')}` : ''}
				<section class="article-canvas">
					<section class="page-head"><h1>${article ? 'Edit article' : 'New article'}</h1><div class="language-switcher" aria-label="Article language" data-current-language="${escapeAttribute(articleLanguage)}">${languageSwitch}</div></section>
					<input class="title-input" name="title" ${isTranslationModeForForm ? '' : 'required'} placeholder="${escapeAttribute(isTranslationModeForForm ? placeholderArticle?.title || 'Article title' : 'Article title')}" value="${escapeAttribute(article?.title || '')}" />
					<textarea class="excerpt-input" name="excerpt" ${isTranslationModeForForm ? '' : 'required'} placeholder="${escapeAttribute(isTranslationModeForForm ? placeholderArticle?.excerpt || 'Article excerpt' : 'Article excerpt')}">${escapeHtml(article?.excerpt || '')}</textarea>
					<div class="cover-picker" data-cover-picker data-media-assets="${escapeAttribute(mediaPayload)}">
						<input type="hidden" name="cover_media_id" data-cover-media-id value="${escapeAttribute(selectedCoverId)}" />
						<input type="hidden" name="current_cover_url" value="${escapeAttribute(article?.cover_url || '')}" />
						<input type="hidden" name="current_cover_alt" value="${escapeAttribute(article?.cover_alt || '')}" />
						<input type="hidden" name="cover_object_position" data-cover-position value="${escapeAttribute(article?.cover_object_position || '50% 50%')}" />
						<input type="hidden" name="related_object_position" data-related-position value="${escapeAttribute(article?.related_object_position || article?.cover_object_position || '50% 50%')}" />
						<input type="hidden" name="cover_crop_scale" data-cover-scale value="${escapeAttribute(article?.cover_crop_scale || 1)}" />
						<input type="hidden" name="related_crop_scale" data-related-scale value="${escapeAttribute(article?.related_crop_scale || article?.cover_crop_scale || 1)}" />
						<input class="cover-upload-input" data-cover-upload type="file" accept="image/*" hidden />
						<div class="cover-dropzone ${article?.cover_url ? 'has-cover' : ''}" data-cover-dropzone tabindex="0">
							<div class="cover-preview-frame" data-cover-preview>
								${article?.cover_url ? `<img src="${escapeAttribute(article.cover_url)}" alt="${escapeAttribute(article.cover_alt || article.title || 'Article cover')}" style="object-position: ${escapeAttribute(article.cover_object_position || '50% 50%')}; transform: scale(${escapeAttribute(article.cover_crop_scale || 1)}); transform-origin: ${escapeAttribute(article.cover_object_position || '50% 50%')}" />` : `<div class="cover-empty"><strong>Set up cover image</strong><div><button type="button" class="secondary" data-cover-upload-button>Upload</button><button type="button" class="secondary" data-cover-library-button>Select from media</button></div><span>Drop file here</span></div>`}
							</div>
							<div class="cover-actions">
								<button type="button" class="secondary" data-cover-upload-button>Upload new</button>
								<button type="button" class="secondary" data-cover-library-button>Find media</button>
								<button type="button" class="secondary" data-crop-mode="cover">Crop cover</button>
								<button type="button" class="secondary" data-crop-mode="related">Crop related</button>
								<button type="button" class="secondary" data-cover-edit-button ${selectedCoverAsset ? '' : 'is-hidden'}">Edit details</button>
								<button type="button" class="secondary icon-button" data-cover-remove-button ${article?.cover_url ? '' : 'is-hidden'}" aria-label="Remove cover">${trashIcon()}</button>
							</div>
							<p class="cover-caption" data-cover-caption>${coverName ? escapeHtml(coverName) : 'No cover selected'}</p>
							<p class="cover-alt-badge" data-cover-alt-badge>${article?.cover_alt ? escapeHtml(article.cover_alt) : ''}</p>
						</div>
						<dialog class="media-dialog" data-media-library-dialog>
							<div class="media-dialog-panel media-library-panel">
								<div class="media-dialog-head"><div><p class="eyebrow">Media library</p><h2>Choose cover</h2></div><button type="button" class="secondary" data-dialog-close>Close</button></div>
								<div class="media-grid" data-media-grid></div>
							</div>
						</dialog>
						<dialog class="media-dialog" data-media-details-dialog>
							<div class="media-dialog-panel">
								<div class="media-dialog-head"><div><p class="eyebrow">Media details</p><h2>Cover image</h2></div><button type="button" class="secondary" data-dialog-close>Close</button></div>
								<img class="media-detail-preview" data-media-detail-preview alt="" />
								<label>Name<input data-media-name placeholder="Image name" /></label>
								<label>Alt text<textarea data-media-alt placeholder="Describe the image for accessibility and SEO"></textarea></label>
								<div class="media-dialog-actions">
									<button type="button" class="secondary" data-dialog-close>Cancel</button>
									<button type="button" data-media-save>Save and use</button>
								</div>
							</div>
						</dialog>
						<dialog class="media-dialog" data-crop-dialog>
							<div class="media-dialog-panel crop-dialog-panel">
								<div class="media-dialog-head"><div><p class="eyebrow" data-crop-eyebrow>Crop</p><h2 data-crop-title>Crop image</h2></div><button type="button" class="secondary" data-dialog-close>Close</button></div>
								<div class="crop-stage" data-crop-stage>
									<img class="crop-backdrop" data-crop-backdrop alt="" />
									<div class="crop-preview" data-crop-preview><img data-crop-image alt="" /></div>
								</div>
								<p class="crop-help">Drag the image to choose the visible area. Scroll over the preview to zoom in or out.</p>
								<div class="media-dialog-actions">
									<button type="button" class="secondary" data-dialog-close>Cancel</button>
									<button type="button" data-crop-save>Save crop</button>
								</div>
							</div>
						</dialog>
					</div>
					<div class="editor-shell block-editor-shell">
					<div class="editor-hint">Use the + button to add Image, YouTube, TLDR, CTA, headings, lists, quotes, and dividers.</div>
						<div id="block-editor" class="block-editor"></div>
						<textarea id="body-markdown" name="body_markdown" data-base-body="${escapeAttribute(isTranslationModeForForm ? placeholderArticle?.body_markdown || '' : '')}">${escapeHtml(article?.body_markdown || '')}</textarea>
					</div>
					<section class="article-faq-editor">
						<div class="article-faq-head">
							<div>
								<p class="eyebrow">FAQ</p>
								<h2>Frequently asked questions</h2>
							</div>
							<p>Published articles require at least 3 completed FAQ items.</p>
						</div>
						<div class="article-faq-list" data-faq-list>${faqFields}</div>
						<button type="button" class="secondary faq-add" data-faq-add>Add FAQ item</button>
					</section>
			</section>
			<aside class="settings-sidebar">
				<div class="page-actions">
					<a class="button secondary ${article?.slug ? '' : 'is-disabled'}" href="${viewHref}" target="_blank" rel="noopener noreferrer">View</a>
					<button class="button secondary" type="submit" form="article-form" name="article_action" value="${publishAction}">${publishLabel}</button>
					<button class="button ${options.justSaved ? 'is-saved' : ''}" type="submit" form="article-form" name="article_action" value="save" data-save-button>${options.justSaved ? 'Saved' : 'Save'}</button>
				</div>
				<div class="settings-group${lockedGroupClass}">
					<h2>Publishing</h2>
					${isTranslationModeForForm ? '<p class="locked-note">Locked for translations. Edit this in English.</p>' : ''}
					<label>Slug<input name="slug" value="${escapeAttribute(article?.slug || '')}" ${lockedAttribute} /></label>
					<label>Author<select name="author_id" required ${lockedAttribute}>${authorOptions}</select></label>
					<label>Published at<input name="published_at" type="datetime-local" value="${escapeAttribute(toDatetimeLocalValue(article?.published_at || ''))}" ${lockedAttribute} /></label>
					${isTranslationModeForForm ? '' : `<input type="hidden" name="status" value="${articleStatus}" />`}
				</div>
				<div class="settings-group${lockedGroupClass}">
					<h2>Categories</h2>
					${isTranslationModeForForm ? '<p class="locked-note">Categories belong to the article, not to one translation.</p>' : ''}
					<div class="checks">${categoryChecks}</div>
				</div>
				<div class="settings-group">
					<h2>SEO</h2>
					<label class="seo-setting">
						<span class="seo-setting-head"><input type="checkbox" name="seo_title_enabled" value="1" data-seo-toggle="seo-title" ${seoTitleEnabled ? 'checked' : ''} /> SEO title</span>
						<input name="seo_title" data-seo-control="seo-title" value="${escapeAttribute(article?.seo_title || '')}" placeholder="Uses article title" ${seoTitleEnabled ? '' : 'disabled'} />
					</label>
					<label class="seo-setting">
						<span class="seo-setting-head"><input type="checkbox" name="seo_description_enabled" value="1" data-seo-toggle="seo-description" ${seoDescriptionEnabled ? 'checked' : ''} /> SEO description</span>
						<textarea name="seo_description" data-seo-control="seo-description" placeholder="Uses article excerpt" ${seoDescriptionEnabled ? '' : 'disabled'}>${escapeHtml(article?.seo_description || '')}</textarea>
					</label>
					<div class="seo-setting og-picker" data-og-picker data-media-assets="${escapeAttribute(mediaPayload)}">
						<label class="seo-setting-head"><input type="checkbox" name="og_image_enabled" value="1" data-seo-toggle="og-image" ${ogImageEnabled ? 'checked' : ''} /> OG image</label>
						<input type="hidden" name="og_image_url" data-og-url value="${escapeAttribute(article?.og_image_url || '')}" ${ogImageEnabled ? '' : 'disabled'} />
						<input type="file" accept="image/*" data-og-upload hidden />
						<div class="og-preview ${ogImageEnabled && article?.og_image_url ? 'has-image' : ''}" data-og-preview>
							${ogImageEnabled && article?.og_image_url ? `<img src="${escapeAttribute(article.og_image_url)}" alt="" /><span>${escapeHtml(ogName)}</span>` : `<span>Uses cover image</span>`}
						</div>
						<div class="og-actions">
							<button type="button" class="secondary" data-og-upload-button ${ogImageEnabled ? '' : 'is-disabled'}">Upload</button>
							<button type="button" class="secondary" data-og-library-button ${ogImageEnabled ? '' : 'is-disabled'}">Find media</button>
							<button type="button" class="secondary icon-button ${ogImageEnabled && article?.og_image_url ? '' : 'is-hidden'}" data-og-remove-button aria-label="Remove custom OG image">${trashIcon()}</button>
						</div>
						<dialog class="media-dialog" data-og-library-dialog>
							<div class="media-dialog-panel media-library-panel">
								<div class="media-dialog-head"><div><p class="eyebrow">Media library</p><h2>Choose OG image</h2></div><button type="button" class="secondary" data-dialog-close>Close</button></div>
								<div class="media-grid" data-og-media-grid></div>
							</div>
						</dialog>
					</div>
				</div>
			</aside>
		</form>
		<script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
		<script src="https://cdn.jsdelivr.net/npm/@editorjs/header@latest"></script>
		<script src="https://cdn.jsdelivr.net/npm/@editorjs/list@latest"></script>
		<script src="https://cdn.jsdelivr.net/npm/@editorjs/quote@latest"></script>
		<script src="https://cdn.jsdelivr.net/npm/@editorjs/delimiter@latest"></script>
		<script src="https://cdn.jsdelivr.net/npm/@editorjs/image@latest"></script>
		<script src="https://cdn.jsdelivr.net/npm/@editorjs/embed@latest"></script>
		<script src="https://cdn.jsdelivr.net/npm/editorjs-drag-drop@1.1.16/dist/bundle.js"></script>
		<script>
			(() => {
					const source = document.getElementById('body-markdown');
					const form = document.querySelector('.article-compose');
					const editorHolder = document.getElementById('block-editor');
					let isSubmitting = false;
					const saveButton = document.querySelector('[data-save-button]');
					const languageSwitcher = document.querySelector('.language-switcher');
					const currentArticleLanguage = languageSwitcher?.dataset.currentLanguage || 'en';
					const isTranslationMode = () => currentArticleLanguage !== 'en';
					const syncLanguageMode = () => {
						form.classList.toggle('is-translation-mode', isTranslationMode());
					};
					languageSwitcher?.addEventListener('click', (event) => {
						const link = event.target instanceof Element ? event.target.closest('a.language-option') : null;
						if (!link || link.classList.contains('active') || link.classList.contains('is-disabled')) return;
						link.classList.add('is-loading');
					});
					syncLanguageMode();
					if (saveButton && new URLSearchParams(window.location.search).get('saved') === '1') {
						saveButton.classList.add('is-saved');
						saveButton.textContent = 'Saved';
						const cleanParams = new URLSearchParams(window.location.search);
						cleanParams.delete('saved');
						const cleanSearch = cleanParams.toString();
						window.history.replaceState({}, '', window.location.pathname + (cleanSearch ? '?' + cleanSearch : ''));
						window.setTimeout(() => {
							saveButton.classList.remove('is-saved');
							saveButton.textContent = 'Save';
						}, 1400);
					}
					const showSubmittingState = (button) => {
						if (!button || button.value !== 'save') return;
						button.classList.remove('is-saved');
						button.classList.add('is-saving');
						button.innerHTML = '<span class="button-spinner" aria-hidden="true"></span><span>Saving</span>';
					};
					const resetSubmittingState = (button) => {
						if (!button || button.value !== 'save') return;
						button.classList.remove('is-saving');
						button.textContent = 'Save';
					};
					const faqList = document.querySelector('[data-faq-list]');
					const renumberFaqs = () => {
						if (!faqList) return;
						faqList.querySelectorAll('.faq-fields').forEach((item, index) => {
							const title = item.querySelector('.faq-fields-head strong');
							if (title) title.textContent = 'FAQ item ' + (index + 1);
						});
					};
					const createFaqItem = () => {
						const item = document.createElement('div');
						item.className = 'faq-fields';
						item.innerHTML = '<div class="faq-fields-head"><strong>FAQ item</strong><button type="button" class="secondary faq-remove" data-faq-remove>Remove</button></div><label>Question<input name="faq_question[]" /></label><label>Answer<textarea name="faq_answer[]"></textarea></label>';
						return item;
					};
					if (faqList) {
						document.querySelector('[data-faq-add]')?.addEventListener('click', () => {
							const item = createFaqItem();
							faqList.appendChild(item);
							renumberFaqs();
							item.querySelector('input')?.focus();
						});
						faqList.addEventListener('click', (event) => {
							const target = event.target instanceof Element ? event.target : null;
							const button = target?.closest('[data-faq-remove]');
							if (!button) return;
							const items = Array.from(faqList.querySelectorAll('.faq-fields'));
							if (items.length <= 1) {
								const item = items[0];
								item?.querySelectorAll('input, textarea').forEach((field) => { field.value = ''; });
								return;
							}
							button.closest('.faq-fields')?.remove();
							renumberFaqs();
						});
						renumberFaqs();
					}
					const coverPicker = document.querySelector('[data-cover-picker]');
					if (coverPicker) {
						let mediaAssets = [];
						let activeMedia = null;
						try { mediaAssets = JSON.parse(coverPicker.dataset.mediaAssets || '[]'); } catch {}
						const mediaIdInput = coverPicker.querySelector('[data-cover-media-id]');
						const uploadInput = coverPicker.querySelector('[data-cover-upload]');
						const dropzone = coverPicker.querySelector('[data-cover-dropzone]');
						const preview = coverPicker.querySelector('[data-cover-preview]');
						const caption = coverPicker.querySelector('[data-cover-caption]');
						const altBadge = coverPicker.querySelector('[data-cover-alt-badge]');
						const coverPositionInput = coverPicker.querySelector('[data-cover-position]');
						const relatedPositionInput = coverPicker.querySelector('[data-related-position]');
						const coverScaleInput = coverPicker.querySelector('[data-cover-scale]');
						const relatedScaleInput = coverPicker.querySelector('[data-related-scale]');
						const libraryDialog = coverPicker.querySelector('[data-media-library-dialog]');
						const detailsDialog = coverPicker.querySelector('[data-media-details-dialog]');
						const cropDialog = coverPicker.querySelector('[data-crop-dialog]');
						const mediaGrid = coverPicker.querySelector('[data-media-grid]');
						const detailPreview = coverPicker.querySelector('[data-media-detail-preview]');
						const nameInput = coverPicker.querySelector('[data-media-name]');
						const altInput = coverPicker.querySelector('[data-media-alt]');
						const cropTitle = coverPicker.querySelector('[data-crop-title]');
						const cropEyebrow = coverPicker.querySelector('[data-crop-eyebrow]');
						const cropStage = coverPicker.querySelector('[data-crop-stage]');
						const cropPreview = coverPicker.querySelector('[data-crop-preview]');
						const cropImage = coverPicker.querySelector('[data-crop-image]');
						const cropBackdrop = coverPicker.querySelector('[data-crop-backdrop]');
						const editButton = coverPicker.querySelector('[data-cover-edit-button]');
						const removeButton = coverPicker.querySelector('[data-cover-remove-button]');
						let cropMode = 'cover';
						let cropState = { x: 50, y: 50, scale: 1 };
						let dragState = null;
						const splitPosition = (value) => {
							const match = String(value || '50% 50%').match(/(-?\\d+(?:\\.\\d+)?)%\\s+(-?\\d+(?:\\.\\d+)?)%/);
							return match ? [Number(match[1]), Number(match[2])] : [50, 50];
						};
						const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
						const cropGeometry = () => {
							const stageRect = cropStage.getBoundingClientRect();
							const previewRect = cropPreview.getBoundingClientRect();
							const naturalWidth = cropImage.naturalWidth || previewRect.width || 1;
							const naturalHeight = cropImage.naturalHeight || previewRect.height || 1;
							const fitScale = Math.max(previewRect.width / naturalWidth, previewRect.height / naturalHeight) * cropState.scale;
							const width = naturalWidth * fitScale;
							const height = naturalHeight * fitScale;
							const minLeft = Math.min(0, previewRect.width - width);
							const minTop = Math.min(0, previewRect.height - height);
							const x = clamp(cropState.x, 0, 100);
							const y = clamp(cropState.y, 0, 100);
							const left = minLeft ? minLeft * (x / 100) : (previewRect.width - width) / 2;
							const top = minTop ? minTop * (y / 100) : (previewRect.height - height) / 2;
							return {
								height,
								left,
								minLeft,
								minTop,
								previewLeft: previewRect.left - stageRect.left,
								previewTop: previewRect.top - stageRect.top,
								top,
								width,
							};
						};
						const applyCropPreview = () => {
							cropState.x = Math.round(clamp(cropState.x, 0, 100) * 100) / 100;
							cropState.y = Math.round(clamp(cropState.y, 0, 100) * 100) / 100;
							const value = cropState.x + '% ' + cropState.y + '%';
							const geometry = cropGeometry();
							for (const image of [cropImage, cropBackdrop]) {
								image.style.width = geometry.width + 'px';
								image.style.height = geometry.height + 'px';
								image.style.objectPosition = '50% 50%';
								image.style.transform = 'none';
								image.style.transformOrigin = value;
							}
							cropImage.style.left = geometry.left + 'px';
							cropImage.style.top = geometry.top + 'px';
							cropBackdrop.style.left = (geometry.previewLeft + geometry.left) + 'px';
							cropBackdrop.style.top = (geometry.previewTop + geometry.top) + 'px';
						};
						const openCrop = (mode) => {
							const image = preview.querySelector('img');
							if (!image) return;
							cropMode = mode;
							const sourceInput = mode === 'related' ? relatedPositionInput : coverPositionInput;
							const scaleInput = mode === 'related' ? relatedScaleInput : coverScaleInput;
							const [x, y] = splitPosition(sourceInput.value);
							cropState = { x, y, scale: clamp(Number(scaleInput.value || 1), 1, 3) };
							for (const cropLayer of [cropImage, cropBackdrop]) {
								cropLayer.src = image.src;
								cropLayer.alt = image.alt || '';
							}
							cropPreview.classList.toggle('is-related', mode === 'related');
							cropEyebrow.textContent = mode === 'related' ? 'Related articles' : 'Cover';
							cropTitle.textContent = mode === 'related' ? 'Crop for related cards' : 'Crop cover image';
							cropDialog.showModal();
							applyCropPreview();
						};
						const setCover = (asset) => {
							activeMedia = asset;
							mediaIdInput.value = asset ? String(asset.id) : '';
							if (asset) {
								preview.innerHTML = '';
								const image = document.createElement('img');
								image.src = asset.url;
								image.alt = asset.alt || asset.display_name || 'Article cover';
								image.style.objectPosition = coverPositionInput.value || '50% 50%';
								image.style.transform = 'scale(' + (coverScaleInput.value || '1') + ')';
								image.style.transformOrigin = coverPositionInput.value || '50% 50%';
								preview.appendChild(image);
								caption.textContent = asset.display_name || asset.alt || asset.key || 'Cover image';
								altBadge.textContent = asset.alt || '';
								dropzone.classList.add('has-cover');
								editButton.classList.remove('is-hidden');
								removeButton.classList.remove('is-hidden');
							} else {
								preview.innerHTML = '<div class="cover-empty"><strong>Set up cover image</strong><div><button type="button" class="secondary" data-cover-upload-button>Upload</button><button type="button" class="secondary" data-cover-library-button>Select from media</button></div><span>Drop file here</span></div>';
								caption.textContent = 'No cover selected';
								altBadge.textContent = '';
								dropzone.classList.remove('has-cover');
								editButton.classList.add('is-hidden');
								removeButton.classList.add('is-hidden');
							}
						};
						const openDetails = (asset) => {
							activeMedia = asset;
							detailPreview.src = asset.url;
							detailPreview.alt = asset.alt || '';
							nameInput.value = asset.display_name || asset.alt || asset.key || '';
							altInput.value = asset.alt || '';
							detailsDialog.showModal();
						};
						const renderLibrary = () => {
							mediaGrid.innerHTML = '';
							if (!mediaAssets.length) {
								const empty = document.createElement('p');
								empty.className = 'muted';
								empty.textContent = 'No media files yet.';
								mediaGrid.appendChild(empty);
								return;
							}
							mediaAssets.forEach((asset) => {
								const tile = document.createElement('button');
								tile.type = 'button';
								tile.className = 'media-tile';
								tile.dataset.mediaId = String(asset.id);
								const thumb = document.createElement('span');
								const image = document.createElement('img');
								image.src = asset.url;
								image.alt = '';
								thumb.appendChild(image);
								const title = document.createElement('strong');
								title.textContent = asset.display_name || asset.alt || asset.key;
								tile.append(thumb, title);
								mediaGrid.appendChild(tile);
							});
						};
						const uploadCover = async (file) => {
							if (!file || !file.type.startsWith('image/')) return;
							dropzone.classList.add('is-uploading');
							const data = new FormData();
							data.append('file', file);
							data.append('display_name', file.name);
							data.append('alt', file.name);
							const response = await fetch('/admin/api/blog/media', { method: 'POST', body: data, credentials: 'same-origin' });
							const result = await response.json();
							dropzone.classList.remove('is-uploading');
							if (!response.ok) throw new Error(result.error || 'Upload failed');
							mediaAssets = [result, ...mediaAssets.filter((asset) => asset.id !== result.id)];
							setCover(result);
							openDetails(result);
						};
						coverPicker.addEventListener('click', (event) => {
							const target = event.target instanceof Element ? event.target : null;
							if (target?.closest('[data-cover-upload-button]')) {
								uploadInput.click();
								return;
							}
							if (target?.closest('[data-cover-library-button]')) {
								renderLibrary();
								libraryDialog.showModal();
								return;
							}
							const cropButton = target?.closest('[data-crop-mode]');
							if (cropButton) {
								openCrop(cropButton.dataset.cropMode || 'cover');
							}
						});
						editButton.addEventListener('click', () => {
							if (activeMedia) openDetails(activeMedia);
						});
						removeButton.addEventListener('click', () => setCover(null));
						uploadInput.addEventListener('change', () => uploadCover(uploadInput.files?.[0]));
						dropzone.addEventListener('dragover', (event) => {
							event.preventDefault();
							dropzone.classList.add('is-dragging');
						});
						dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragging'));
						dropzone.addEventListener('drop', (event) => {
							event.preventDefault();
							dropzone.classList.remove('is-dragging');
							uploadCover(event.dataTransfer?.files?.[0]);
						});
						mediaGrid.addEventListener('click', (event) => {
							const target = event.target instanceof Element ? event.target : null;
							const tile = target?.closest('[data-media-id]');
							if (!tile) return;
							const asset = mediaAssets.find((item) => String(item.id) === tile.dataset.mediaId);
							if (!asset) return;
							libraryDialog.close();
							setCover(asset);
							openDetails(asset);
						});
						coverPicker.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
						coverPicker.querySelector('[data-media-save]').addEventListener('click', async () => {
							if (!activeMedia) return;
							const data = new FormData();
							data.append('display_name', nameInput.value.trim());
							data.append('alt', altInput.value.trim());
							const response = await fetch('/admin/api/blog/media/' + activeMedia.id, { method: 'POST', body: data, credentials: 'same-origin' });
							const result = await response.json();
							if (!response.ok) throw new Error(result.error || 'Save failed');
							mediaAssets = mediaAssets.map((asset) => asset.id === result.id ? result : asset);
							setCover(result);
							detailsDialog.close();
						});
						cropStage.addEventListener('pointerdown', (event) => {
							event.preventDefault();
							cropStage.setPointerCapture(event.pointerId);
							const geometry = cropGeometry();
							dragState = { left: geometry.left, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, top: geometry.top };
						});
						cropStage.addEventListener('pointermove', (event) => {
							if (!dragState || dragState.pointerId !== event.pointerId) return;
							const geometry = cropGeometry();
							const nextLeft = clamp(dragState.left + event.clientX - dragState.startX, geometry.minLeft, 0);
							const nextTop = clamp(dragState.top + event.clientY - dragState.startY, geometry.minTop, 0);
							cropState.x = geometry.minLeft ? nextLeft / geometry.minLeft * 100 : 50;
							cropState.y = geometry.minTop ? nextTop / geometry.minTop * 100 : 50;
							applyCropPreview();
						});
						cropStage.addEventListener('pointerup', () => { dragState = null; });
						cropStage.addEventListener('pointercancel', () => { dragState = null; });
						cropStage.addEventListener('wheel', (event) => {
							event.preventDefault();
							const zoomStep = Math.min(.025, Math.max(.004, Math.abs(event.deltaY) * .00025));
							const next = cropState.scale + (event.deltaY < 0 ? zoomStep : -zoomStep);
							cropState.scale = Math.round(clamp(next, 1, 3) * 100) / 100;
							applyCropPreview();
						}, { passive: false });
						window.addEventListener('resize', () => {
							if (cropDialog.open) applyCropPreview();
						});
						coverPicker.querySelector('[data-crop-save]').addEventListener('click', () => {
							const value = cropState.x + '% ' + cropState.y + '%';
							const scale = String(cropState.scale);
							(cropMode === 'related' ? relatedPositionInput : coverPositionInput).value = value;
							(cropMode === 'related' ? relatedScaleInput : coverScaleInput).value = scale;
							const image = preview.querySelector('img');
							if (image && cropMode === 'cover') {
								image.style.objectPosition = value;
								image.style.transform = 'scale(' + scale + ')';
								image.style.transformOrigin = value;
							}
							cropDialog.close();
						});
						const selected = mediaAssets.find((asset) => String(asset.id) === mediaIdInput.value);
						if (selected) setCover(selected);
						const currentImage = preview.querySelector('img');
						if (currentImage) currentImage.style.objectPosition = coverPositionInput.value || '50% 50%';
					}
					document.querySelectorAll('[data-seo-toggle]').forEach((toggle) => {
						const key = toggle.dataset.seoToggle;
						const control = document.querySelector('[data-seo-control="' + key + '"]');
						const sync = () => {
							if (!control) return;
							control.disabled = !toggle.checked;
						};
						toggle.addEventListener('change', sync);
						sync();
					});
					const ogPicker = document.querySelector('[data-og-picker]');
					if (ogPicker) {
						let ogMediaAssets = [];
						try { ogMediaAssets = JSON.parse(ogPicker.dataset.mediaAssets || '[]'); } catch {}
						const ogToggle = ogPicker.querySelector('[data-seo-toggle="og-image"]');
						const ogUrlInput = ogPicker.querySelector('[data-og-url]');
						const ogPreview = ogPicker.querySelector('[data-og-preview]');
						const ogUpload = ogPicker.querySelector('[data-og-upload]');
						const ogUploadButton = ogPicker.querySelector('[data-og-upload-button]');
						const ogLibraryButton = ogPicker.querySelector('[data-og-library-button]');
						const ogRemoveButton = ogPicker.querySelector('[data-og-remove-button]');
						const ogLibraryDialog = ogPicker.querySelector('[data-og-library-dialog]');
						const ogMediaGrid = ogPicker.querySelector('[data-og-media-grid]');
						const setOgImage = (asset) => {
							ogUrlInput.value = asset ? asset.url : '';
							ogPreview.classList.toggle('has-image', Boolean(asset));
							ogPreview.innerHTML = '';
							if (asset) {
								const image = document.createElement('img');
								image.src = asset.url;
								image.alt = '';
								const label = document.createElement('span');
								label.textContent = asset.display_name || asset.alt || asset.key || 'OG image';
								ogPreview.append(image, label);
							} else {
								const label = document.createElement('span');
								label.textContent = 'Uses cover image';
								ogPreview.appendChild(label);
							}
							ogRemoveButton.classList.toggle('is-hidden', !asset);
						};
						const syncOg = () => {
							const enabled = ogToggle.checked;
							ogUrlInput.disabled = !enabled;
							for (const button of [ogUploadButton, ogLibraryButton]) button.classList.toggle('is-disabled', !enabled);
							if (!enabled) setOgImage(null);
						};
						const renderOgLibrary = () => {
							ogMediaGrid.innerHTML = '';
							if (!ogMediaAssets.length) {
								const empty = document.createElement('p');
								empty.className = 'muted';
								empty.textContent = 'No media files yet.';
								ogMediaGrid.appendChild(empty);
								return;
							}
							ogMediaAssets.forEach((asset) => {
								const tile = document.createElement('button');
								tile.type = 'button';
								tile.className = 'media-tile';
								tile.dataset.mediaId = String(asset.id);
								const thumb = document.createElement('span');
								const image = document.createElement('img');
								image.src = asset.url;
								image.alt = '';
								thumb.appendChild(image);
								const title = document.createElement('strong');
								title.textContent = asset.display_name || asset.alt || asset.key;
								tile.append(thumb, title);
								ogMediaGrid.appendChild(tile);
							});
						};
						const uploadOgImage = async (file) => {
							if (!file || !file.type.startsWith('image/')) return;
							const data = new FormData();
							data.append('file', file);
							data.append('display_name', file.name);
							data.append('alt', file.name);
							const response = await fetch('/admin/api/blog/media', { method: 'POST', body: data, credentials: 'same-origin' });
							const result = await response.json();
							if (!response.ok) throw new Error(result.error || 'Upload failed');
							ogMediaAssets = [result, ...ogMediaAssets.filter((asset) => asset.id !== result.id)];
							setOgImage(result);
						};
						ogToggle.addEventListener('change', syncOg);
						ogUploadButton.addEventListener('click', () => { if (ogToggle.checked) ogUpload.click(); });
						ogLibraryButton.addEventListener('click', () => {
							if (!ogToggle.checked) return;
							renderOgLibrary();
							ogLibraryDialog.showModal();
						});
						ogRemoveButton.addEventListener('click', () => setOgImage(null));
						ogUpload.addEventListener('change', () => uploadOgImage(ogUpload.files?.[0]));
						ogMediaGrid.addEventListener('click', (event) => {
							const target = event.target instanceof Element ? event.target : null;
							const tile = target?.closest('[data-media-id]');
							if (!tile) return;
							const asset = ogMediaAssets.find((item) => String(item.id) === tile.dataset.mediaId);
							if (!asset) return;
							setOgImage(asset);
							ogLibraryDialog.close();
						});
						ogPicker.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
						syncOg();
					}
				class CtaTool {
					static get toolbox() {
						return { title: 'CTA', icon: '<svg width="17" height="14" viewBox="0 0 17 14"><path d="M1 7h13M10 2l5 5-5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>' };
					}
					constructor({ data }) {
						this.data = data || {};
					}
					render() {
						const wrapper = document.createElement('div');
						wrapper.className = 'cta-tool';
						wrapper.innerHTML = '<div class="cta-preview"><div class="cta-preview-beams"><span></span><span></span></div><div class="cta-preview-copy"><strong data-preview-title>Modern Payroll for Global Teams</strong><p data-preview-text>Manage payroll and contractor payouts in 150+ countries with local currencies, cards, wallets, and crypto</p><span data-preview-button>Explore Payroll</span></div><div class="cta-mockup"><div class="cta-mockup-card cta-mockup-card-top"><img src="/pages/blog/assets/15-photo-1494790108377-be9c29b29330.jpg" alt="" /><b>Sarah J.</b><small>Engineering</small><span>$8,500.00</span></div><div class="cta-mockup-card cta-mockup-card-bottom"><img src="/pages/blog/assets/20-photo-1599566150163-29194dcaad36.jpg" alt="" /><b>Alex C.</b><small>Design</small><span>4.2 ETH</span></div></div></div><label>CTA title<input data-field="title" placeholder="Modern Payroll for Global Teams" /></label><label>Text<textarea data-field="text" placeholder="Manage payroll and contractor payouts in 150+ countries with local currencies, cards, wallets, and crypto"></textarea></label><label>Button label<input data-field="button" placeholder="Explore Payroll" /></label><label>Button URL<input data-field="url" placeholder="https://garna.io/" /></label>';
						for (const field of ['title', 'text', 'button', 'url']) {
							const input = wrapper.querySelector('[data-field="' + field + '"]');
							if (input) input.value = this.data[field] || '';
						}
						const sync = () => {
							wrapper.querySelector('[data-preview-title]').textContent = wrapper.querySelector('[data-field="title"]').value || 'Modern Payroll for Global Teams';
							wrapper.querySelector('[data-preview-text]').textContent = wrapper.querySelector('[data-field="text"]').value || 'Manage payroll and contractor payouts in 150+ countries with local currencies, cards, wallets, and crypto';
							wrapper.querySelector('[data-preview-button]').textContent = wrapper.querySelector('[data-field="button"]').value || 'Explore Payroll';
						};
						wrapper.querySelectorAll('input, textarea').forEach((input) => input.addEventListener('input', sync));
						sync();
						return wrapper;
					}
					save(wrapper) {
						const value = (field) => wrapper.querySelector('[data-field="' + field + '"]')?.value.trim() || '';
						return { title: value('title'), text: value('text'), button: value('button'), url: value('url') };
					}
				}
				class TldrTool {
					static get toolbox() {
						return { title: 'TLDR', icon: '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M9 1 3 9h5l-1 6 6-8H8l1-6Z" fill="currentColor"/></svg>' };
					}
					constructor({ data }) {
						this.data = data || {};
					}
					render() {
						const wrapper = document.createElement('div');
						wrapper.className = 'tldr-tool';
						const items = Array.isArray(this.data.items) && this.data.items.length ? this.data.items : ['', '', ''];
						wrapper.innerHTML = '<label>Title<input data-field="title" value="' + (this.data.title || 'TLDR') + '" /></label><div class="tldr-items"></div><button type="button" class="tldr-add">Add point</button>';
						const list = wrapper.querySelector('.tldr-items');
						const addItem = (value = '') => {
							const row = document.createElement('label');
							row.className = 'tldr-item';
							row.innerHTML = '<span>Point</span><textarea data-item rows="2" placeholder="Short takeaway"></textarea><button type="button" aria-label="Remove point">Remove</button>';
							row.querySelector('[data-item]').value = value;
							row.querySelector('button').addEventListener('click', () => row.remove());
							list.appendChild(row);
						};
						items.forEach(addItem);
						wrapper.querySelector('.tldr-add').addEventListener('click', () => addItem());
						return wrapper;
					}
					save(wrapper) {
						return {
							title: wrapper.querySelector('[data-field="title"]')?.value.trim() || 'TLDR',
							items: Array.from(wrapper.querySelectorAll('[data-item]')).map((item) => item.value.trim()).filter(Boolean),
						};
					}
				}
				const markEditorButtonsSafe = () => {
					editorHolder.querySelectorAll('button:not([type])').forEach((button) => {
						button.setAttribute('type', 'button');
					});
				};
				const stripTags = (value) => value.replace(/<[^>]*>/g, '');
				const markdownToEditorData = (markdown) => ({
					time: Date.now(),
					blocks: markdown.split(/\\n{2,}/).map((block) => {
					const text = block.trim();
					if (!text) return null;
					const image = text.match(/^!\\[([^\\]]*)\\]\\(([^)\\s]+)\\)$/);
					if (image) return { type: 'image', data: { file: { url: image[2] }, caption: image[1], withBorder: false, withBackground: false, stretched: false } };
					const youtube = text.match(/^\\{\\{youtube:(.+)\\}\\}$/);
					if (youtube) return { type: 'embed', data: { service: 'youtube', source: youtube[1], embed: youtube[1], caption: '' } };
					const cta = text.match(/^\\{\\{cta:(\\{.*\\})\\}\\}$/);
					if (cta) {
						try { return { type: 'cta', data: JSON.parse(cta[1]) }; } catch { return null; }
					}
					const tldr = text.match(/^\\{\\{tldr:(\\{.*\\})\\}\\}$/);
					if (tldr) {
						try { return { type: 'tldr', data: JSON.parse(tldr[1]) }; } catch { return null; }
					}
					if (text.startsWith('### ')) return { type: 'header', data: { text: text.slice(4), level: 3 } };
					if (text.startsWith('## ')) return { type: 'header', data: { text: text.slice(3), level: 2 } };
					if (text.startsWith('# ')) return { type: 'header', data: { text: text.slice(2), level: 2 } };
					if (text === '---') return { type: 'delimiter', data: {} };
					if (text.split('\\n').every((line) => line.startsWith('- '))) {
						return { type: 'list', data: { style: 'unordered', items: text.split('\\n').map((line) => line.slice(2)) } };
					}
					if (text.startsWith('> ')) return { type: 'quote', data: { text: text.slice(2), caption: '', alignment: 'left' } };
					return { type: 'paragraph', data: { text: text.replace(/\\n/g, '<br>') } };
				}).filter(Boolean),
					version: '2.0.0',
				});
				const textWithBreaks = (value) => stripTags(String(value || '').replace(/<br\\s*\\/?\\>/g, '\\n')).trim();
				const blankEditorDataFromStructure = (data) => ({
					...data,
					blocks: (data.blocks || []).map((block) => {
						if (block.type === 'paragraph') return { ...block, data: { ...block.data, text: '' } };
						if (block.type === 'header') return { ...block, data: { ...block.data, text: '' } };
						if (block.type === 'list') return { ...block, data: { ...block.data, items: (block.data.items || []).map((item) => typeof item === 'string' ? '' : { ...item, content: '' }) } };
						if (block.type === 'quote') return { ...block, data: { ...block.data, text: '', caption: '' } };
						if (block.type === 'image') return { ...block, data: { ...block.data, caption: '' } };
						if (block.type === 'cta') return { ...block, data: { ...block.data, title: '', text: '', button: '', url: block.data.url || '' } };
						if (block.type === 'tldr') return { ...block, data: { ...block.data, title: '', items: (block.data.items || []).map(() => '') } };
						return block;
					}),
				});
				const editorToMarkdown = (data) => data.blocks.map((block) => {
					if (block.type === 'header') return '#'.repeat(block.data.level || 2) + ' ' + stripTags(block.data.text || '').trim();
					if (block.type === 'list') return (block.data.items || []).map((item) => '- ' + stripTags(typeof item === 'string' ? item : item.content || '').trim()).join('\\n');
					if (block.type === 'quote') return '> ' + stripTags(block.data.text || '').trim();
					if (block.type === 'delimiter') return '---';
					if (block.type === 'image') return '![' + stripTags(block.data.caption || '') + '](' + (block.data.file?.url || block.data.url || '') + ')';
					if (block.type === 'embed' && block.data.service === 'youtube') return '{{youtube:' + (block.data.source || block.data.embed || '') + '}}';
					if (block.type === 'cta') return '{{cta:' + JSON.stringify({
						title: stripTags(block.data.title || ''),
						text: stripTags(block.data.text || ''),
						button: stripTags(block.data.button || ''),
						url: block.data.url || '',
					}) + '}}';
					if (block.type === 'tldr') return '{{tldr:' + JSON.stringify({
						title: stripTags(block.data.title || 'TLDR'),
						items: (block.data.items || []).map((item) => stripTags(item || '')).filter(Boolean),
					}) + '}}';
					return textWithBreaks(block.data.text);
				}).filter(Boolean).join('\\n\\n');
				const ListTool = window.EditorjsList || window.List;
				const tools = {
					header: { class: window.Header, inlineToolbar: true, config: { levels: [2, 3], defaultLevel: 2 } },
					list: { class: ListTool, inlineToolbar: true },
					quote: { class: window.Quote, inlineToolbar: true },
					delimiter: window.Delimiter,
					cta: CtaTool,
					tldr: TldrTool,
				};
				if (window.ImageTool) {
					tools.image = {
						class: window.ImageTool,
						config: {
							uploader: {
								uploadByFile: async (file) => {
									const data = new FormData();
									data.append('file', file);
									data.append('alt', file.name);
									const response = await fetch('/admin/api/blog/media', { method: 'POST', body: data, credentials: 'same-origin' });
									const result = await response.json();
									if (!response.ok) throw new Error(result.error || 'Upload failed');
									return { success: 1, file: { url: result.url } };
								},
							},
						},
					};
				}
				if (window.Embed) tools.embed = { class: window.Embed, inlineToolbar: true, config: { services: { youtube: true } } };
				const initialEditorData = isTranslationMode() && !source.value.trim() && source.dataset.baseBody
					? blankEditorDataFromStructure(markdownToEditorData(source.dataset.baseBody))
					: markdownToEditorData(source.value);
				const blockStructureSignature = (data) => (data.blocks || []).map((block) => block.type).join('|');
				const initialBlockStructure = blockStructureSignature(initialEditorData);
				const cloneEditorData = (data) => JSON.parse(JSON.stringify(data));
				let lastValidEditorData = cloneEditorData(initialEditorData);
				let isRestoringEditorStructure = false;
				let structureGuardTimer = 0;
				const restoreEditorStructure = async () => {
					if (!isTranslationMode() || isRestoringEditorStructure) return;
					const data = await editor.save();
					if (blockStructureSignature(data) === initialBlockStructure) {
						lastValidEditorData = cloneEditorData(data);
						return;
					}
					isRestoringEditorStructure = true;
					await editor.render(lastValidEditorData);
					markEditorButtonsSafe();
					window.setTimeout(() => { isRestoringEditorStructure = false; }, 0);
				};
				const editor = new EditorJS({
					holder: 'block-editor',
					placeholder: 'Write the article. Use the + button to add a block.',
					data: initialEditorData,
					tools,
					onChange: () => {
						if (!isTranslationMode() || isRestoringEditorStructure) return;
						window.clearTimeout(structureGuardTimer);
						structureGuardTimer = window.setTimeout(() => {
							restoreEditorStructure().catch(() => {});
						}, 180);
					},
					onReady: () => {
						markEditorButtonsSafe();
						new MutationObserver(markEditorButtonsSafe).observe(editorHolder, { childList: true, subtree: true });
						if (!isTranslationMode()) new DragDrop(editor, '1px dashed #487c1f');
						syncLanguageMode();
					},
				});
				form.addEventListener('click', (event) => {
					const target = event.target instanceof Element ? event.target : null;
					if (!target?.closest('.codex-editor')) return;
					markEditorButtonsSafe();
					if (target.closest('.ce-popover-item')) {
						editorHolder.classList.add('is-moving');
						window.setTimeout(() => editorHolder.classList.remove('is-moving'), 260);
					}
				}, true);
				form.addEventListener('submit', async (event) => {
					if (isSubmitting) return;
					event.preventDefault();
					const submitter = event.submitter;
					if (!form.reportValidity()) return;
					try {
						const data = await editor.save();
						if (isTranslationMode() && blockStructureSignature(data) !== initialBlockStructure) {
							throw new Error('This language version can only edit existing blocks. Switch to English to add, remove, or reorder blocks.');
						}
						source.value = editorToMarkdown(data);
						showSubmittingState(submitter);
						let actionInput = form.querySelector('input[name="article_action"][data-submit-action]');
						if (!actionInput) {
							actionInput = document.createElement('input');
							actionInput.type = 'hidden';
							actionInput.name = 'article_action';
							actionInput.dataset.submitAction = 'true';
							form.appendChild(actionInput);
						}
						actionInput.value = submitter?.value || 'save';
						isSubmitting = true;
						form.submit();
					} catch (error) {
						resetSubmittingState(submitter);
						isSubmitting = false;
						window.alert(error?.message || 'Could not prepare the article for saving.');
					}
				});
			})();
		</script>`);
}

function authorTranslationCompletionPercent(baseAuthor: BlogAuthor, translation: Partial<BlogAuthor> | null): number {
	const checks: Array<[string | null | undefined, string | null | undefined]> = [
		[baseAuthor.name, translation?.name],
		[baseAuthor.role, translation?.role],
		[baseAuthor.bio, translation?.bio],
	];
	const required = checks.filter(([source]) => Boolean(source?.trim()));
	if (!required.length) return 100;
	const completed = required.filter(([, value]) => Boolean(value?.trim())).length;
	return Math.round((completed / required.length) * 100);
}

async function renderAuthorForm(env: BlogEnv, email: string, author?: BlogAuthor, options: { language?: string; justSaved?: boolean } = {}): Promise<Response> {
	const mediaAssets = await listMediaAssets(env);
	const language = normalizeArticleLanguage(options.language || 'en');
	const baseAuthor = author?.id && language !== 'en' ? await getAuthorById(env, author.id, 'en') : author;
	const authorId = author?.id;
	const translationEntries = authorId
		? await Promise.all(languages
			.filter((item) => item.value !== 'en')
			.map(async (item) => [item.value, await getAuthorTranslationDraft(env, authorId, item.value)] as const))
		: [];
	const translations = new Map(translationEntries);
	const activeTranslation = author?.id && language !== 'en' ? translations.get(language) || null : null;
	const sourceAuthor = baseAuthor || author;
	if (author && language !== 'en') {
		author = {
			...author,
			name: activeTranslation?.name || '',
			role: activeTranslation?.role || '',
			bio: activeTranslation?.bio || '',
		};
	}
	const isTranslationMode = language !== 'en';
	const action = author ? `/admin/api/blog/authors/${author.id}` : '/admin/api/blog/authors';
	const selectedAvatarAsset = mediaAssets.find((asset) => asset.url === author?.avatar_url);
	const selectedAvatarId = selectedAvatarAsset ? String(selectedAvatarAsset.id) : author?.avatar_url ? 'current' : '';
	const mediaPayload = safeJson(mediaAssets.map((asset) => ({
		id: asset.id,
		key: asset.key,
		url: asset.url,
		display_name: asset.display_name || '',
		alt: asset.alt || '',
		content_type: asset.content_type || '',
	})));
	const avatarName = selectedAvatarAsset?.display_name || selectedAvatarAsset?.alt || selectedAvatarAsset?.key || author?.avatar_alt || '';
	const languageSwitch = languages.map((item) => {
		const active = item.value === language;
		const href = author?.id ? `/admin/blog/authors/${author.id}${item.value === 'en' ? '' : `?lang=${encodeURIComponent(item.value)}`}` : '#';
		const progress = item.value === 'en' || !sourceAuthor ? '' : `<small>${authorTranslationCompletionPercent(sourceAuthor, translations.get(item.value) || null)}%</small>`;
		return `<a class="language-option ${active ? 'active' : ''} ${author?.id ? '' : 'is-disabled'}" title="${escapeAttribute(item.label)}" href="${escapeAttribute(href)}" ${active ? 'aria-current="true"' : ''}><span>${escapeHtml(item.value.toUpperCase())}</span>${progress}</a>`;
	}).join('');
	const lockedClass = isTranslationMode ? ' is-locked' : '';
	const lockedAttribute = isTranslationMode ? 'disabled' : '';
	return adminShell(author ? 'Edit author' : 'New author', 'authors', email, `<form id="author-form" class="article-compose" method="post" action="${action}">
			<input type="hidden" name="language" value="${escapeAttribute(language)}" />
			${isTranslationMode ? `<input type="hidden" name="slug" value="${escapeAttribute(sourceAuthor?.slug || '')}" />
			<input type="hidden" name="email" value="${escapeAttribute(sourceAuthor?.email || '')}" />
			<input type="hidden" name="x_url" value="${escapeAttribute(sourceAuthor?.x_url || '')}" />
			<input type="hidden" name="linkedin_url" value="${escapeAttribute(sourceAuthor?.linkedin_url || '')}" />
			<input type="hidden" name="avatar_url" value="${escapeAttribute(sourceAuthor?.avatar_url || '')}" />
			<input type="hidden" name="avatar_alt" value="${escapeAttribute(sourceAuthor?.avatar_alt || '')}" />
			<input type="hidden" name="avatar_object_position" value="${escapeAttribute(sourceAuthor?.avatar_object_position || '50% 50%')}" />
			<input type="hidden" name="avatar_crop_scale" value="${escapeAttribute(sourceAuthor?.avatar_crop_scale || 1)}" />` : ''}
			<section class="article-canvas">
				<section class="page-head"><h1>${author ? 'Edit author' : 'New author'}</h1><div class="language-switcher" aria-label="Author language" data-current-language="${escapeAttribute(language)}">${languageSwitch}</div></section>
				<input class="title-input" name="name" ${isTranslationMode ? '' : 'required'} placeholder="${escapeAttribute(isTranslationMode ? sourceAuthor?.name || 'Author name' : 'Author name')}" value="${escapeAttribute(author?.name || '')}" />
				<textarea class="excerpt-input" name="bio" placeholder="${escapeAttribute(isTranslationMode ? sourceAuthor?.bio || 'Author bio' : 'Author bio')}">${escapeHtml(author?.bio || '')}</textarea>
				<label>Role<input name="role" placeholder="${escapeAttribute(isTranslationMode ? sourceAuthor?.role || 'Author role' : 'Author role')}" value="${escapeAttribute(author?.role || '')}" /></label>
				<div class="cover-picker author-avatar-picker${isTranslationMode ? ' is-locked' : ''}" data-author-avatar-picker data-media-assets="${escapeAttribute(mediaPayload)}">
					<input type="hidden" name="avatar_media_id" data-cover-media-id value="${escapeAttribute(selectedAvatarId)}" />
					<input type="hidden" name="avatar_url" value="${escapeAttribute(author?.avatar_url || '')}" data-avatar-url />
					<input type="hidden" name="avatar_alt" value="${escapeAttribute(author?.avatar_alt || '')}" data-avatar-alt />
					<input type="hidden" name="avatar_object_position" data-cover-position value="${escapeAttribute(author?.avatar_object_position || '50% 50%')}" />
					<input type="hidden" name="avatar_crop_scale" data-cover-scale value="${escapeAttribute(author?.avatar_crop_scale || 1)}" />
					<input class="cover-upload-input" data-cover-upload type="file" accept="image/*" hidden ${lockedAttribute} />
					<div class="cover-dropzone ${author?.avatar_url ? 'has-cover' : ''}" data-cover-dropzone tabindex="0">
						<div class="cover-preview-frame avatar-preview-frame" data-cover-preview>
							${author?.avatar_url ? `<img src="${escapeAttribute(author.avatar_url)}" alt="${escapeAttribute(author.avatar_alt || author.name || 'Author avatar')}" style="${cropStyle(author.avatar_object_position, author.avatar_crop_scale)}" />` : `<div class="cover-empty"><strong>Set up author avatar</strong><div><button type="button" class="secondary" data-cover-upload-button ${isTranslationMode ? 'is-disabled' : ''}">Upload</button><button type="button" class="secondary" data-cover-library-button ${isTranslationMode ? 'is-disabled' : ''}">Select from media</button></div><span>Drop file here</span></div>`}
						</div>
						<div class="cover-actions">
							<button type="button" class="secondary" data-cover-upload-button ${isTranslationMode ? 'is-disabled' : ''}">Upload new</button>
							<button type="button" class="secondary" data-cover-library-button ${isTranslationMode ? 'is-disabled' : ''}">Find media</button>
							<button type="button" class="secondary" data-crop-mode="cover" ${author?.avatar_url ? '' : 'disabled'}>Crop avatar</button>
							<button type="button" class="secondary" data-cover-edit-button ${selectedAvatarAsset ? '' : 'is-hidden'}">Edit details</button>
							<button type="button" class="secondary icon-button" data-cover-remove-button ${author?.avatar_url ? '' : 'is-hidden'}" aria-label="Remove avatar">${trashIcon()}</button>
						</div>
						<p class="cover-caption" data-cover-caption>${avatarName ? escapeHtml(avatarName) : 'No avatar selected'}</p>
						<p class="cover-alt-badge" data-cover-alt-badge>${author?.avatar_alt ? escapeHtml(author.avatar_alt) : ''}</p>
					</div>
					<dialog class="media-dialog" data-media-library-dialog>
						<div class="media-dialog-panel media-library-panel">
							<div class="media-dialog-head"><div><p class="eyebrow">Media library</p><h2>Choose avatar</h2></div><button type="button" class="secondary" data-dialog-close>Close</button></div>
							<div class="media-grid" data-media-grid></div>
						</div>
					</dialog>
					<dialog class="media-dialog" data-media-details-dialog>
						<div class="media-dialog-panel">
							<div class="media-dialog-head"><div><p class="eyebrow">Media details</p><h2>Author avatar</h2></div><button type="button" class="secondary" data-dialog-close>Close</button></div>
							<img class="media-detail-preview" data-media-detail-preview alt="" />
							<label>Name<input data-media-name placeholder="Image name" /></label>
							<label>Alt text<textarea data-media-alt placeholder="Describe the author image"></textarea></label>
							<div class="media-dialog-actions"><button type="button" class="secondary" data-dialog-close>Cancel</button><button type="button" data-media-save>Save and use</button></div>
						</div>
					</dialog>
					<dialog class="media-dialog" data-crop-dialog>
						<div class="media-dialog-panel crop-dialog-panel">
							<div class="media-dialog-head"><div><p class="eyebrow">Avatar</p><h2 data-crop-title>Crop avatar</h2></div><button type="button" class="secondary" data-dialog-close>Close</button></div>
							<div class="crop-stage" data-crop-stage><img class="crop-backdrop" data-crop-backdrop alt="" /><div class="crop-preview is-related" data-crop-preview><img data-crop-image alt="" /></div></div>
							<p class="crop-help">Drag the image to choose the visible area. Scroll over the preview to zoom in or out.</p>
							<div class="media-dialog-actions"><button type="button" class="secondary" data-dialog-close>Cancel</button><button type="button" data-crop-save>Save crop</button></div>
						</div>
					</dialog>
				</div>
			</section>
			<aside class="settings-sidebar">
				<div class="page-actions">
					<a class="button secondary ${author?.slug ? '' : 'is-disabled'}" href="/en/blog/author/${escapeAttribute(sourceAuthor?.slug || author?.slug || '')}" target="_blank" rel="noopener noreferrer">View</a>
					<button class="button ${options.justSaved ? 'is-saved' : ''}" type="submit" form="author-form" name="author_action" value="save" data-save-button>${options.justSaved ? 'Saved' : 'Save'}</button>
				</div>
				<div class="settings-group${lockedClass}">
					<h2>Profile settings</h2>
					${isTranslationMode ? '<p class="locked-note">Slug, contacts, and avatar belong to the author profile. Edit them in English.</p>' : ''}
					<label>Slug<input name="slug" value="${escapeAttribute(sourceAuthor?.slug || author?.slug || '')}" ${lockedAttribute} /></label>
					<label>Email<input name="email" type="email" value="${escapeAttribute(sourceAuthor?.email || author?.email || '')}" ${lockedAttribute} /></label>
					<label>X profile URL<input name="x_url" type="url" placeholder="https://x.com/..." value="${escapeAttribute(sourceAuthor?.x_url || author?.x_url || '')}" ${lockedAttribute} /></label>
					<label>LinkedIn profile URL<input name="linkedin_url" type="url" placeholder="https://www.linkedin.com/in/..." value="${escapeAttribute(sourceAuthor?.linkedin_url || author?.linkedin_url || '')}" ${lockedAttribute} /></label>
				</div>
			</aside>
		</form>
		<script>${authorAvatarEditorScript()}</script>`);
}

function renderCategoryForm(email: string): Response {
	return adminShell('New category', 'categories', email, `<section class="page-head"><div><p class="eyebrow">Taxonomy</p><h1>New category</h1></div><a class="button secondary" href="/admin/blog/categories">Back</a></section>
		<form class="surface form-grid" method="post" action="/admin/api/blog/categories">
			<label>Name<input name="name" required /></label>
			<label>Slug<input name="slug" /></label>
			<label>Description<textarea name="description"></textarea></label>
			<button>Save category</button>
		</form>`);
}

function renderMediaForm(email: string): Response {
	return adminShell('Upload media', 'media', email, `<section class="page-head"><div><p class="eyebrow">Assets</p><h1>Upload media</h1></div><a class="button secondary" href="/admin/blog/media">Back</a></section>
		<form class="surface form-grid" method="post" enctype="multipart/form-data" action="/admin/api/blog/media">
			<label>File<input name="file" type="file" required /></label>
			<label>Alt text<input name="alt" /></label>
			<button>Upload media</button>
		</form>`);
}

async function saveArticle(request: Request, env: BlogEnv, id?: number): Promise<Response> {
	const form = await request.formData();
	const title = String(form.get('title') || '').trim();
	const slug = String(form.get('slug') || slugify(title)).trim();
	const excerpt = String(form.get('excerpt') || '').trim();
	const bodyMarkdown = String(form.get('body_markdown') || '').trim();
	const language = normalizeArticleLanguage(String(form.get('language') || 'en'));
	const action = String(form.get('article_action') || 'save');
	const requestedStatus = action === 'publish' ? 'published' : action === 'unpublish' ? 'draft' : form.get('status') === 'published' ? 'published' : 'draft';
	const publishedAt = parseDatetimeLocal(String(form.get('published_at') || '').trim()) || (action === 'publish' ? new Date().toISOString() : null);
	const cover = await resolveArticleCover(form, env);
	const input: BlogArticleInput = {
		language,
		title,
		slug,
		excerpt,
		body_markdown: bodyMarkdown,
		status: requestedStatus,
		author_id: Number(form.get('author_id')),
		cover_url: cover.url,
		cover_alt: cover.alt,
		cover_object_position: normalizeObjectPosition(String(form.get('cover_object_position') || '')),
		related_object_position: normalizeObjectPosition(String(form.get('related_object_position') || '')),
		cover_crop_scale: normalizeCropScale(String(form.get('cover_crop_scale') || '')),
		related_crop_scale: normalizeCropScale(String(form.get('related_crop_scale') || '')),
		read_time_minutes: calculateReadTimeMinutes([title, excerpt, bodyMarkdown].join('\n\n')),
		seo_title: form.get('seo_title_enabled') ? String(form.get('seo_title') || '').trim() || null : null,
		seo_description: form.get('seo_description_enabled') ? String(form.get('seo_description') || '').trim() || null : null,
		og_image_url: form.get('og_image_enabled') ? String(form.get('og_image_url') || '').trim() || null : null,
		published_at: publishedAt,
		category_ids: form.getAll('category_ids').map((value) => Number(value)).filter(Boolean),
		faqs: parseArticleFaqs(form),
	};
	if (language === 'en') {
		validateArticle(input);
		const articleId = await upsertArticle(env, input, id);
		return redirect(`/admin/blog/articles/${articleId}${action === 'save' ? '?saved=1' : ''}`);
	}
	if (!id) throw new Error('Save the English article before adding translations');
	validateArticleTranslation(input);
	await upsertArticleTranslation(env, id, input);
	const savedQuery = action === 'save' ? '&saved=1' : '';
	return redirect(`/admin/blog/articles/${id}?lang=${language}${savedQuery}`);
}

function parseArticleFaqs(form: FormData): Array<{ question: string; answer: string }> {
	const questions = form.getAll('faq_question[]');
	const answers = form.getAll('faq_answer[]');
	const length = Math.max(questions.length, answers.length);
	const faqs: Array<{ question: string; answer: string }> = [];
	for (let index = 0; index < length; index += 1) {
		const question = String(questions[index] || '').trim();
		const answer = String(answers[index] || '').trim();
		if (question && answer) faqs.push({ question, answer });
	}
	return faqs;
}

function calculateReadTimeMinutes(markdown: string): number {
	const plainText = markdown
		.replace(/\{\{(cta|tldr):(\{[^\n]*\})\}\}/g, (_match, type, json) => {
			try {
				const data = JSON.parse(json);
				if (type === 'tldr') return [data.title, ...(Array.isArray(data.items) ? data.items : [])].filter(Boolean).join(' ');
				return [data.title, data.text, data.button].filter(Boolean).join(' ');
			} catch {
				return ' ';
			}
		})
		.replace(/\{\{youtube:[^}]+\}\}/g, ' ')
		.replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
		.replace(/\[[^\]]+]\([^)]+\)/g, (match) => match.replace(/^\[([^\]]+)].*$/, '$1'))
		.replace(/[`*_>#-]/g, ' ')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&[a-z]+;/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	const words = plainText ? plainText.split(/\s+/).length : 0;
	return Math.max(1, Math.ceil(words / 220));
}

async function resolveArticleCover(form: FormData, env: BlogEnv): Promise<{ url: string | null; alt: string | null }> {
	const upload = form.get('cover_file');
	if (upload instanceof File && upload.size > 0) {
		const saved = await saveMediaFile(env, upload, String(form.get('cover_file_alt') || '').trim());
		return { url: saved.url, alt: saved.alt };
	}

	const selectedMediaId = String(form.get('cover_media_id') || '').trim();
	if (selectedMediaId === 'current') {
		return {
			url: String(form.get('current_cover_url') || '').trim() || null,
			alt: String(form.get('current_cover_alt') || '').trim() || null,
		};
	}

	if (selectedMediaId && env.DB) {
		const media = await env.DB.prepare('SELECT url, alt FROM media_assets WHERE id = ?').bind(Number(selectedMediaId)).first<{ url: string; alt: string | null }>();
		if (media) return { url: media.url, alt: media.alt || null };
	}

	return { url: null, alt: null };
}

async function resolveAuthorAvatar(form: FormData, env: BlogEnv): Promise<{ url: string | null; alt: string | null }> {
	const selectedMediaId = String(form.get('avatar_media_id') || '').trim();
	if (selectedMediaId && selectedMediaId !== 'current' && env.DB) {
		const media = await env.DB.prepare('SELECT url, alt FROM media_assets WHERE id = ?').bind(Number(selectedMediaId)).first<{ url: string; alt: string | null }>();
		if (media) return { url: media.url, alt: media.alt || null };
	}
	return {
		url: String(form.get('avatar_url') || '').trim() || null,
		alt: String(form.get('avatar_alt') || '').trim() || null,
	};
}

async function saveAuthor(request: Request, env: BlogEnv, id?: number): Promise<Response> {
	const form = await request.formData();
	const language = normalizeArticleLanguage(String(form.get('language') || 'en'));
	const name = String(form.get('name') || '').trim();
	if (language !== 'en') {
		if (!id) throw new Error('Save the English author profile before adding translations');
		await upsertAuthorTranslation(env, id, language, {
			name,
			role: String(form.get('role') || '').trim() || null,
			bio: String(form.get('bio') || '').trim() || null,
		});
		return redirect(`/admin/blog/authors/${id}?lang=${encodeURIComponent(language)}&saved=1`);
	}
	const avatar = await resolveAuthorAvatar(form, env);
	const authorId = await upsertAuthor(env, {
		name,
		slug: String(form.get('slug') || slugify(name)).trim(),
		role: String(form.get('role') || '').trim(),
		email: String(form.get('email') || '').trim() || null,
		x_url: String(form.get('x_url') || '').trim() || null,
		linkedin_url: String(form.get('linkedin_url') || '').trim() || null,
		bio: String(form.get('bio') || '').trim(),
		avatar_url: avatar.url,
		avatar_alt: avatar.alt,
		avatar_object_position: normalizeObjectPosition(String(form.get('avatar_object_position') || '')),
		avatar_crop_scale: normalizeCropScale(String(form.get('avatar_crop_scale') || '')),
	}, id);
	return redirect(`/admin/blog/authors/${authorId}?saved=1`);
}

async function saveCategory(request: Request, env: BlogEnv): Promise<Response> {
	const form = await request.formData();
	const name = String(form.get('name') || '').trim();
	await upsertCategory(env, {
		name,
		slug: String(form.get('slug') || slugify(name)).trim(),
		description: String(form.get('description') || '').trim(),
	});
	return redirect('/admin/blog/categories');
}

async function uploadMedia(request: Request, env: BlogEnv): Promise<Response> {
	if (!env.BLOG_MEDIA) return jsonResponse({ error: 'R2 binding is required' }, { status: 500 });
	const form = await request.formData();
	const file = form.get('file');
	if (!(file instanceof File)) return jsonResponse({ error: 'file is required' }, { status: 400 });
	const saved = await saveMediaFile(env, file, String(form.get('alt') || '').trim(), String(form.get('display_name') || '').trim());
	if ((request.headers.get('Accept') || '').includes('text/html')) return redirect('/admin/blog/media');
	return jsonResponse(saved);
}

async function updateMedia(request: Request, env: BlogEnv, id: number): Promise<Response> {
	if (!env.DB) return jsonResponse({ error: 'D1 DB binding is required' }, { status: 500 });
	const form = await request.formData();
	const displayName = String(form.get('display_name') || '').trim() || null;
	const alt = String(form.get('alt') || '').trim() || null;
	await env.DB.prepare('UPDATE media_assets SET display_name = ?, alt = ? WHERE id = ?').bind(displayName, alt, id).run();
	const row = await env.DB.prepare('SELECT * FROM media_assets WHERE id = ?').bind(id).first<any>();
	if (!row) return jsonResponse({ error: 'Media asset not found' }, { status: 404 });
	return jsonResponse(mediaAssetJson(row));
}

async function saveMediaFile(env: BlogEnv, file: File, alt: string, displayName?: string): Promise<{ id: number | null; key: string; url: string; display_name: string | null; alt: string | null; content_type: string | null }> {
	if (!env.BLOG_MEDIA) throw new Error('R2 binding is required');
	const key = `blog/${Date.now()}-${slugify(file.name)}`;
	await env.BLOG_MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
	const url = `/blog-media/${key}`;
	const normalizedAlt = alt || file.name || null;
	const normalizedDisplayName = displayName || file.name || null;
	let id: number | null = null;
	if (env.DB) {
		const result = await env.DB.prepare(
			'INSERT INTO media_assets (key, url, display_name, alt, content_type, size_bytes) VALUES (?, ?, ?, ?, ?, ?)'
		)
			.bind(key, url, normalizedDisplayName, normalizedAlt, file.type || null, file.size || null)
			.run();
		id = Number(result.meta.last_row_id);
	}
	return { id, key, url, display_name: normalizedDisplayName, alt: normalizedAlt, content_type: file.type || null };
}

function mediaAssetJson(row: any): { id: number; key: string; url: string; display_name: string | null; alt: string | null; content_type: string | null } {
	return {
		id: row.id,
		key: row.key,
		url: row.url,
		display_name: row.display_name || null,
		alt: row.alt || null,
		content_type: row.content_type || null,
	};
}

function authorAvatarEditorScript(): string {
	return `
		(() => {
			const picker = document.querySelector('[data-author-avatar-picker]');
			if (!picker || picker.classList.contains('is-locked')) return;
			let mediaAssets = [];
			let activeMedia = null;
			try { mediaAssets = JSON.parse(picker.dataset.mediaAssets || '[]'); } catch {}
			const mediaIdInput = picker.querySelector('[data-cover-media-id]');
			const avatarUrlInput = picker.querySelector('[data-avatar-url]');
			const avatarAltInput = picker.querySelector('[data-avatar-alt]');
			const positionInput = picker.querySelector('[data-cover-position]');
			const scaleInput = picker.querySelector('[data-cover-scale]');
			const uploadInput = picker.querySelector('[data-cover-upload]');
			const dropzone = picker.querySelector('[data-cover-dropzone]');
			const preview = picker.querySelector('[data-cover-preview]');
			const caption = picker.querySelector('[data-cover-caption]');
			const altBadge = picker.querySelector('[data-cover-alt-badge]');
			const editButton = picker.querySelector('[data-cover-edit-button]');
			const removeButton = picker.querySelector('[data-cover-remove-button]');
			const libraryDialog = picker.querySelector('[data-media-library-dialog]');
			const detailsDialog = picker.querySelector('[data-media-details-dialog]');
			const cropDialog = picker.querySelector('[data-crop-dialog]');
			const mediaGrid = picker.querySelector('[data-media-grid]');
			const detailPreview = picker.querySelector('[data-media-detail-preview]');
			const nameInput = picker.querySelector('[data-media-name]');
			const altInput = picker.querySelector('[data-media-alt]');
			const cropStage = picker.querySelector('[data-crop-stage]');
			const cropPreview = picker.querySelector('[data-crop-preview]');
			const cropImage = picker.querySelector('[data-crop-image]');
			const cropBackdrop = picker.querySelector('[data-crop-backdrop]');
			let cropState = { x: 50, y: 50, scale: 1 };
			let dragState = null;
			const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
			const splitPosition = (value) => {
				const match = String(value || '50% 50%').match(/(-?\\d+(?:\\.\\d+)?)%\\s+(-?\\d+(?:\\.\\d+)?)%/);
				return match ? [Number(match[1]), Number(match[2])] : [50, 50];
			};
			const currentImage = () => preview.querySelector('img');
			const applyImageStyle = (image, position = positionInput.value || '50% 50%', scale = scaleInput.value || '1') => {
				image.style.objectPosition = position;
				image.style.transform = 'scale(' + scale + ')';
				image.style.transformOrigin = position;
			};
			const setAvatar = (asset) => {
				activeMedia = asset;
				mediaIdInput.value = asset ? String(asset.id) : '';
				avatarUrlInput.value = asset?.url || '';
				avatarAltInput.value = asset?.alt || '';
				if (asset) {
					preview.innerHTML = '';
					const image = document.createElement('img');
					image.src = asset.url;
					image.alt = asset.alt || asset.display_name || 'Author avatar';
					applyImageStyle(image);
					preview.appendChild(image);
					caption.textContent = asset.display_name || asset.alt || asset.key || 'Author avatar';
					altBadge.textContent = asset.alt || '';
					dropzone.classList.add('has-cover');
					editButton.classList.toggle('is-hidden', !asset.id);
					removeButton.classList.remove('is-hidden');
				} else {
					preview.innerHTML = '<div class="cover-empty"><strong>Set up author avatar</strong><div><button type="button" class="secondary" data-cover-upload-button>Upload</button><button type="button" class="secondary" data-cover-library-button>Select from media</button></div><span>Drop file here</span></div>';
					caption.textContent = 'No avatar selected';
					altBadge.textContent = '';
					dropzone.classList.remove('has-cover');
					editButton.classList.add('is-hidden');
					removeButton.classList.add('is-hidden');
				}
			};
			const renderLibrary = () => {
				mediaGrid.innerHTML = '';
				if (!mediaAssets.length) {
					const empty = document.createElement('p');
					empty.className = 'muted';
					empty.textContent = 'No media files yet.';
					mediaGrid.appendChild(empty);
					return;
				}
				mediaAssets.forEach((asset) => {
					const tile = document.createElement('button');
					tile.type = 'button';
					tile.className = 'media-tile';
					tile.dataset.mediaId = String(asset.id);
					const thumb = document.createElement('span');
					const image = document.createElement('img');
					image.src = asset.url;
					image.alt = '';
					thumb.appendChild(image);
					const title = document.createElement('strong');
					title.textContent = asset.display_name || asset.alt || asset.key;
					tile.append(thumb, title);
					mediaGrid.appendChild(tile);
				});
			};
			const openDetails = (asset) => {
				if (!asset) return;
				activeMedia = asset;
				detailPreview.src = asset.url;
				detailPreview.alt = asset.alt || '';
				nameInput.value = asset.display_name || asset.alt || asset.key || '';
				altInput.value = asset.alt || '';
				detailsDialog.showModal();
			};
			const uploadAvatar = async (file) => {
				if (!file || !file.type.startsWith('image/')) return;
				dropzone.classList.add('is-uploading');
				const data = new FormData();
				data.append('file', file);
				data.append('display_name', file.name);
				data.append('alt', file.name);
				const response = await fetch('/admin/api/blog/media', { method: 'POST', body: data, credentials: 'same-origin' });
				const result = await response.json();
				dropzone.classList.remove('is-uploading');
				if (!response.ok) throw new Error(result.error || 'Upload failed');
				mediaAssets = [result, ...mediaAssets.filter((asset) => asset.id !== result.id)];
				positionInput.value = '50% 50%';
				scaleInput.value = '1';
				setAvatar(result);
				openDetails(result);
			};
			const cropGeometry = () => {
				const stageRect = cropStage.getBoundingClientRect();
				const previewRect = cropPreview.getBoundingClientRect();
				const naturalWidth = cropImage.naturalWidth || previewRect.width || 1;
				const naturalHeight = cropImage.naturalHeight || previewRect.height || 1;
				const fitScale = Math.max(previewRect.width / naturalWidth, previewRect.height / naturalHeight) * cropState.scale;
				const width = naturalWidth * fitScale;
				const height = naturalHeight * fitScale;
				const minLeft = Math.min(0, previewRect.width - width);
				const minTop = Math.min(0, previewRect.height - height);
				const left = minLeft ? minLeft * (clamp(cropState.x, 0, 100) / 100) : (previewRect.width - width) / 2;
				const top = minTop ? minTop * (clamp(cropState.y, 0, 100) / 100) : (previewRect.height - height) / 2;
				return { width, height, left, top, minLeft, minTop, previewLeft: previewRect.left - stageRect.left, previewTop: previewRect.top - stageRect.top };
			};
			const applyCropPreview = () => {
				cropState.x = Math.round(clamp(cropState.x, 0, 100) * 100) / 100;
				cropState.y = Math.round(clamp(cropState.y, 0, 100) * 100) / 100;
				const geometry = cropGeometry();
				for (const image of [cropImage, cropBackdrop]) {
					image.style.width = geometry.width + 'px';
					image.style.height = geometry.height + 'px';
					image.style.objectPosition = '50% 50%';
					image.style.transform = 'none';
				}
				cropImage.style.left = geometry.left + 'px';
				cropImage.style.top = geometry.top + 'px';
				cropBackdrop.style.left = (geometry.previewLeft + geometry.left) + 'px';
				cropBackdrop.style.top = (geometry.previewTop + geometry.top) + 'px';
			};
			const openCrop = () => {
				const image = currentImage();
				if (!image) return;
				const [x, y] = splitPosition(positionInput.value);
				cropState = { x, y, scale: clamp(Number(scaleInput.value || 1), 1, 3) };
				for (const layer of [cropImage, cropBackdrop]) {
					layer.src = image.src;
					layer.alt = image.alt || '';
				}
				cropDialog.showModal();
				applyCropPreview();
			};
			picker.addEventListener('click', (event) => {
				const target = event.target instanceof Element ? event.target : null;
				if (target?.closest('[data-cover-upload-button]')) {
					uploadInput.click();
					return;
				}
				if (target?.closest('[data-cover-library-button]')) {
					renderLibrary();
					libraryDialog.showModal();
					return;
				}
				if (target?.closest('[data-crop-mode]')) openCrop();
			});
			editButton.addEventListener('click', () => openDetails(activeMedia));
			removeButton.addEventListener('click', () => setAvatar(null));
			uploadInput.addEventListener('change', () => uploadAvatar(uploadInput.files?.[0]).catch((error) => window.alert(error.message || 'Upload failed')));
			dropzone.addEventListener('dragover', (event) => {
				event.preventDefault();
				dropzone.classList.add('is-dragging');
			});
			dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragging'));
			dropzone.addEventListener('drop', (event) => {
				event.preventDefault();
				dropzone.classList.remove('is-dragging');
				uploadAvatar(event.dataTransfer?.files?.[0]).catch((error) => window.alert(error.message || 'Upload failed'));
			});
			mediaGrid.addEventListener('click', (event) => {
				const target = event.target instanceof Element ? event.target : null;
				const tile = target?.closest('[data-media-id]');
				if (!tile) return;
				const asset = mediaAssets.find((item) => String(item.id) === tile.dataset.mediaId);
				if (!asset) return;
				libraryDialog.close();
				positionInput.value = '50% 50%';
				scaleInput.value = '1';
				setAvatar(asset);
				openDetails(asset);
			});
			picker.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
			picker.querySelector('[data-media-save]').addEventListener('click', async () => {
				if (!activeMedia?.id) return;
				const data = new FormData();
				data.append('display_name', nameInput.value.trim());
				data.append('alt', altInput.value.trim());
				const response = await fetch('/admin/api/blog/media/' + activeMedia.id, { method: 'POST', body: data, credentials: 'same-origin' });
				const result = await response.json();
				if (!response.ok) throw new Error(result.error || 'Save failed');
				mediaAssets = mediaAssets.map((asset) => asset.id === result.id ? result : asset);
				setAvatar(result);
				detailsDialog.close();
			});
			cropStage.addEventListener('pointerdown', (event) => {
				event.preventDefault();
				cropStage.setPointerCapture(event.pointerId);
				const geometry = cropGeometry();
				dragState = { pointerId: event.pointerId, left: geometry.left, top: geometry.top, startX: event.clientX, startY: event.clientY };
			});
			cropStage.addEventListener('pointermove', (event) => {
				if (!dragState || dragState.pointerId !== event.pointerId) return;
				const geometry = cropGeometry();
				const nextLeft = clamp(dragState.left + event.clientX - dragState.startX, geometry.minLeft, 0);
				const nextTop = clamp(dragState.top + event.clientY - dragState.startY, geometry.minTop, 0);
				cropState.x = geometry.minLeft ? nextLeft / geometry.minLeft * 100 : 50;
				cropState.y = geometry.minTop ? nextTop / geometry.minTop * 100 : 50;
				applyCropPreview();
			});
			cropStage.addEventListener('pointerup', () => { dragState = null; });
			cropStage.addEventListener('pointercancel', () => { dragState = null; });
			cropStage.addEventListener('wheel', (event) => {
				event.preventDefault();
				const zoomStep = Math.min(.025, Math.max(.004, Math.abs(event.deltaY) * .00025));
				const next = cropState.scale + (event.deltaY < 0 ? zoomStep : -zoomStep);
				cropState.scale = Math.round(clamp(next, 1, 3) * 100) / 100;
				applyCropPreview();
			}, { passive: false });
			window.addEventListener('resize', () => { if (cropDialog.open) applyCropPreview(); });
			picker.querySelector('[data-crop-save]').addEventListener('click', () => {
				const value = cropState.x + '% ' + cropState.y + '%';
				positionInput.value = value;
				scaleInput.value = String(cropState.scale);
				const image = currentImage();
				if (image) applyImageStyle(image, value, String(cropState.scale));
				cropDialog.close();
			});
			const selected = mediaAssets.find((asset) => String(asset.id) === mediaIdInput.value);
			if (selected) setAvatar(selected);
			const image = currentImage();
			if (image) applyImageStyle(image);
		})();
	`;
}

function validateArticle(input: BlogArticleInput): void {
	const missing: Array<[string, string | number | null | undefined]> = [
		['title', input.title],
		['language', input.language],
		['slug', input.slug],
		['excerpt', input.excerpt],
		['body_markdown', input.body_markdown],
		['author_id', input.author_id],
	];
	const missingFields = missing.filter(([, value]) => !value).map(([field]) => field);
	if (input.status === 'published') {
		const publishRequired: Array<[string, string | number | null | undefined]> = [
			['cover_alt', input.cover_alt],
		];
		for (const [field, value] of publishRequired) {
			if (!value) missingFields.push(field);
		}
		if ((input.faqs || []).length < 3) missingFields.push('faq_minimum_3');
	}
	if (missingFields.length) throw new Error(`Missing required article fields: ${missingFields.join(', ')}`);
}

function validateArticleTranslation(input: BlogArticleInput): void {
	const missing: Array<[string, string | number | null | undefined]> = [
		['language', input.language],
	];
	const missingFields = missing.filter(([, value]) => !value).map(([field]) => field);
	if (missingFields.length) throw new Error(`Missing required article translation fields: ${missingFields.join(', ')}`);
}

function translationCompletionPercent(baseArticle: any, translation: Partial<BlogArticle> | null): number {
	const checks: Array<[string | null | undefined, string | null | undefined]> = [
		[baseArticle?.title, translation?.title],
		[baseArticle?.excerpt, translation?.excerpt],
		[baseArticle?.body_markdown, translation?.body_markdown],
		[baseArticle?.cover_alt, translation?.cover_alt],
		[baseArticle?.seo_title, translation?.seo_title],
		[baseArticle?.seo_description, translation?.seo_description],
	];
	for (const [index, faq] of (baseArticle?.faqs || []).entries()) {
		checks.push([faq.question, translation?.faqs?.[index]?.question]);
		checks.push([faq.answer, translation?.faqs?.[index]?.answer]);
	}
	const required = checks.filter(([source]) => Boolean(source?.trim()));
	if (!required.length) return 100;
	const completed = required.filter(([, value]) => Boolean(value?.trim())).length;
	return Math.round((completed / required.length) * 100);
}

function adminHtml(title: string, body: string): Response {
	return htmlResponse(`<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="robots" content="noindex,nofollow" />
	<title>${escapeHtml(title)} | Garna</title>
	<style>
		:root { color-scheme: light; --ink: #171717; --muted: #737373; --line: #e8e6e1; --paper: #ffffff; --wash: #f7f6f2; --accent: #487c1f; }
		* { box-sizing: border-box; }
		body { margin: 0; background: var(--wash); color: var(--ink); font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
		a { color: inherit; } h1 { margin: 0; font-size: 32px; line-height: 1.1; letter-spacing: 0; } h2 { margin-top: 0; }
		.admin-layout { height: 100vh; min-height: 100vh; display: grid; grid-template-columns: 226px minmax(0, 1058px); justify-content: center; overflow: hidden; background: var(--wash); }
		.sidebar { display: flex; flex-direction: column; height: 100vh; overflow-y: auto; padding: 24px 14px 24px 22px; background: transparent; }
		.brand { display: flex; justify-content: space-between; align-items: center; margin-bottom: 26px; padding: 0 8px; }
		.brand strong { font-size: 15px; } .brand span { color: var(--muted); font-size: 12px; }
		.create-row { display: grid; grid-template-columns: 1fr 42px; margin: 0 0 24px; position: relative; }
		.button, button { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; background: var(--accent); color: #fff; border: 0; border-radius: 7px; padding: 0 14px; text-decoration: none; cursor: pointer; font: inherit; font-weight: 650; }
		.icon-button { width: 40px; padding: 0; }
		.icon-button svg { display: block; }
		.create-row .button { border-radius: 7px 0 0 7px; }
		.create-row details { position: relative; }
		.create-row summary { list-style: none; display: flex; align-items: center; justify-content: center; width: 42px; height: 40px; background: var(--accent); color: #fff; border-left: 1px solid rgba(255,255,255,.35); border-radius: 0 7px 7px 0; padding: 0; cursor: pointer; user-select: none; font-weight: 760; }
		.create-row summary::-webkit-details-marker { display: none; }
		.create-row details[open] summary { border-radius: 0 7px 0 0; }
		.chevron { display: inline-block; transform: translateY(-1px); }
		.create-row details[open] .chevron { transform: rotate(180deg) translateY(1px); }
		.create-menu { position: absolute; left: auto; right: 0; top: 40px; width: calc(100vw - 52px); max-width: 184px; z-index: 20; background: #fff; border: 1px solid var(--line); border-radius: 0 0 8px 8px; box-shadow: 0 18px 44px rgba(28, 24, 18, .12); padding: 6px; }
		.create-menu a { display: block; text-decoration: none; padding: 10px 12px; border-radius: 6px; color: var(--ink); }
		.create-menu a:hover { background: var(--wash); }
		.nav { display: grid; gap: 3px; }
		.nav a { text-decoration: none; color: #6b665d; padding: 9px 4px; border-radius: 0; font-weight: 560; }
		.nav a.active { color: var(--ink); font-weight: 720; }
		.nav a:hover { color: var(--ink); }
		.sidebar-footer { margin-top: auto; padding: 24px 0 0; color: var(--muted); font-size: 12px; max-width: 190px; }
		.sidebar-footer a { display: inline-block; margin-top: 8px; color: var(--ink); }
		.main { height: 100vh; min-width: 0; overflow-y: auto; padding: 30px 34px 56px 28px; }
		.main:has(.article-compose) { overflow: hidden; padding: 0; }
		.page-head { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
		.page-head p { margin: 0; color: var(--muted); } .eyebrow { text-transform: uppercase; letter-spacing: .08em; font-size: 12px; font-weight: 700; margin-bottom: 8px !important; }
		.page-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; align-content: center; gap: 8px; position: sticky; top: 0; z-index: 5; min-height: var(--admin-sticky-height); margin: 0; padding: 0; background: var(--wash); }
		.page-actions::before { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: -1; background: var(--wash); }
		.page-actions .button { min-height: 38px; padding: 0 10px; }
		.page-actions .button.is-saving { gap: 8px; pointer-events: none; }
		.page-actions .button.is-saved { background: #365f19; }
		.button-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.44); border-top-color: #fff; border-radius: 999px; animation: button-spin .72s linear infinite; }
		@keyframes button-spin { to { transform: rotate(360deg); } }
		.is-disabled { opacity: .46; pointer-events: none; }
		.surface, .panel { background: var(--paper); border: 1px solid var(--line); border-radius: 8px; padding: 20px; box-shadow: 0 1px 0 rgba(28, 24, 18, .03); }
		.narrow { max-width: 460px; margin: 10vh auto; }
		.form-grid { display: grid; gap: 14px; max-width: 920px; }
		.article-compose { --admin-sticky-height: 78px; --admin-sticky-gap: 14px; display: grid; grid-template-columns: minmax(0, 712px) 320px; gap: 26px; align-items: stretch; width: 100%; height: 100vh; overflow: hidden; }
		.article-canvas { min-width: 0; width: 100%; max-width: 880px; height: 100%; overflow-y: auto; padding-top: 0; padding-bottom: 56px; }
		.article-canvas > .page-head { position: sticky; top: 0; z-index: 5; margin: 0 0 var(--admin-sticky-gap); min-height: var(--admin-sticky-height); padding: 0; background: var(--wash); }
		.article-canvas > .page-head h1 { font-size: 18px; line-height: 38px; font-weight: 720; }
		.language-switcher { display: inline-flex; align-items: center; gap: 4px; min-height: 38px; padding: 4px; border: 1px solid var(--line); border-radius: 7px; background: #fff; box-shadow: 0 1px 0 rgba(28,24,18,.03); }
		.language-option { display: inline-flex; align-items: center; justify-content: center; gap: 4px; min-width: 42px; min-height: 28px; margin: 0; padding: 0 8px; border-radius: 5px; color: #6b665d; cursor: pointer; font-size: 12px; font-weight: 680; letter-spacing: 0; text-decoration: none; user-select: none; }
		.language-option span { display: inline-flex; align-items: center; justify-content: center; height: 100%; }
		.language-option small { color: #8f887d; font-size: 10px; font-weight: 650; line-height: 1; }
		.language-option:hover { background: var(--wash); color: var(--ink); }
		.language-option.active { background: var(--accent); color: #fff; }
		.language-option.active small { color: rgba(255,255,255,.82); }
		.language-option.is-loading { opacity: .72; pointer-events: none; }
		.title-input { width: 100%; background: #fff; color: var(--ink); border: 1px solid #d9d6ce; border-radius: 7px; padding: 12px 14px; font: inherit; font-size: 34px; line-height: 1.15; font-weight: 760; letter-spacing: 0; }
		.title-input:focus { outline: 2px solid rgba(72,124,31,.22); border-color: var(--accent); }
		.excerpt-input { display: block; width: 100%; min-height: 94px; margin-top: 12px; background: #fff; color: var(--ink); border: 1px solid #d9d6ce; border-radius: 7px; padding: 10px 12px; font: inherit; line-height: 1.45; resize: vertical; }
		.excerpt-input:focus { outline: 2px solid rgba(72,124,31,.22); border-color: var(--accent); }
		.cover-picker { margin-top: 12px; }
		.cover-dropzone { position: relative; display: grid; overflow: hidden; border: 1px dashed #c9c5bb; border-radius: 8px; background: #fbfaf7; transition: border-color .18s ease, background .18s ease; }
		.cover-dropzone.has-cover { border: 0; background: transparent; }
		.cover-dropzone.is-dragging, .cover-dropzone:focus-visible { border-color: var(--accent); background: #f3f8ed; outline: 2px solid rgba(72,124,31,.18); }
		.cover-dropzone.is-uploading { opacity: .68; pointer-events: none; }
		.cover-preview-frame { display: grid; min-height: 250px; place-items: center; overflow: hidden; border-radius: 8px; background: #f1f0ec; }
		.cover-preview-frame img { display: block; width: 100%; height: 100%; max-height: 320px; object-fit: cover; }
		.cover-empty { display: grid; gap: 14px; place-items: center; min-height: 250px; padding: 28px; color: #6b665d; text-align: center; }
		.cover-empty strong { color: var(--ink); font-size: 20px; }
		.cover-empty div { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
		.cover-empty span { font-size: 13px; line-height: 1.45; }
		.cover-actions { display: none; position: absolute; left: 50%; bottom: 14px; z-index: 2; width: max-content; max-width: calc(100% - 28px); transform: translateX(-50%); flex-wrap: wrap; justify-content: center; gap: 8px; padding: 10px; border-radius: 8px; background: rgba(255,255,255,.78); backdrop-filter: blur(10px); box-shadow: 0 12px 32px rgba(28,24,18,.16); }
		.cover-dropzone.has-cover .cover-actions { display: flex; }
		.cover-actions .button, .cover-actions button { min-height: 34px; padding: 0 12px; font-size: 12px; line-height: 1; font-weight: 520; }
		.cover-actions .icon-button { width: 34px; padding: 0; }
		.cover-caption { position: absolute; left: 14px; top: 14px; z-index: 2; margin: 0; max-width: calc(100% - 28px); overflow: hidden; border-radius: 999px; padding: 6px 10px; background: rgba(255,255,255,.76); color: #5d584d; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; backdrop-filter: blur(10px); }
		.cover-alt-badge { position: absolute; right: 14px; top: 14px; z-index: 2; margin: 0; max-width: min(48%, 360px); overflow: hidden; border-radius: 999px; padding: 6px 10px; background: rgba(255,255,255,.76); color: #5d584d; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; backdrop-filter: blur(10px); }
		.cover-dropzone:not(.has-cover) .cover-caption { display: none; }
		.cover-dropzone:not(.has-cover) .cover-alt-badge, .cover-alt-badge:empty { display: none; }
		.author-avatar-picker { max-width: 420px; }
		.author-avatar-picker .cover-dropzone.has-cover { aspect-ratio: 1 / 1; }
		.author-avatar-picker .cover-preview-frame { aspect-ratio: 1 / 1; min-height: 320px; border-radius: 999px; }
		.author-avatar-picker .cover-preview-frame img { max-height: none; }
		.author-avatar-picker .cover-actions { bottom: 18px; }
		.is-hidden { display: none !important; }
		.media-dialog { width: min(920px, calc(100vw - 40px)); border: 0; border-radius: 10px; padding: 0; background: transparent; }
		.media-dialog::backdrop { background: rgba(20, 18, 14, .42); backdrop-filter: blur(4px); }
		.media-dialog-panel { display: grid; gap: 16px; max-height: min(760px, calc(100vh - 48px)); overflow: auto; background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 18px; box-shadow: 0 24px 80px rgba(28,24,18,.22); }
		.media-dialog-head { display: flex; align-items: start; justify-content: space-between; gap: 16px; }
		.media-dialog-head h2 { margin: 0; font-size: 24px; }
		.media-library-panel { min-height: 520px; }
		.media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
		.media-tile { display: grid; gap: 8px; min-height: 0; padding: 8px; background: #fff; color: var(--ink); border: 1px solid var(--line); border-radius: 8px; text-align: left; box-shadow: none; }
		.media-tile:hover { border-color: var(--accent); background: #f8fbf4; }
		.media-tile span { display: block; aspect-ratio: 4 / 3; overflow: hidden; border-radius: 6px; background: #f1f0ec; }
		.media-tile img { width: 100%; height: 100%; object-fit: cover; }
		.media-tile strong { overflow: hidden; color: var(--ink); font-size: 13px; line-height: 1.25; font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
		.media-detail-preview { width: 100%; max-height: 360px; object-fit: cover; border-radius: 8px; border: 1px solid var(--line); background: #f1f0ec; }
		.media-dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }
		.crop-dialog-panel { width: min(860px, calc(100vw - 40px)); }
		.crop-stage { position: relative; display: grid; min-height: 520px; place-items: center; overflow: hidden; border-radius: 10px; border: 1px solid var(--line); background: #111; cursor: grab; touch-action: none; user-select: none; }
		.crop-stage:active { cursor: grabbing; }
		.crop-backdrop { position: absolute; max-width: none; object-fit: fill; filter: blur(14px) brightness(.58); }
		.crop-preview { position: relative; z-index: 1; width: min(92%, 760px); aspect-ratio: 16 / 7; overflow: hidden; border: 0; border-radius: 8px; box-shadow: none; background: transparent; }
		.crop-preview.is-related { width: min(66%, 480px); aspect-ratio: 1 / 1; }
		.crop-preview img { position: absolute; max-width: none; object-fit: fill; object-position: 50% 50%; will-change: left, top, width, height; }
		.crop-help { margin: -4px 0 0; color: var(--muted); font-size: 13px; line-height: 1.45; }
			.editor-shell { margin-top: 24px; background: var(--paper); border: 1px solid var(--line); border-radius: 8px; overflow: visible; }
			.editor-hint { padding: 12px 16px; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 13px; background: #fbfaf7; border-radius: 8px 8px 0 0; }
			.block-editor { min-height: 560px; padding: 24px 56px 42px; font-size: 18px; line-height: 1.7; }
			.block-editor .codex-editor__redactor { max-width: min(100%, 768px); margin: 0 auto; }
			.block-editor .ce-block__content, .block-editor .ce-toolbar__content { max-width: 768px; }
			.block-editor .ce-toolbar__content { left: 34px; }
			.block-editor .ce-toolbar__plus, .block-editor .ce-toolbar__settings-btn { width: 30px; height: 30px; border-radius: 6px; }
			.block-editor .ce-toolbar__plus { color: var(--accent); background: rgba(72,124,31,.08); }
			.block-editor .ce-popover { z-index: 30; }
			.article-compose.is-translation-mode .block-editor .ce-toolbar__plus,
			.article-compose.is-translation-mode .block-editor .ce-toolbar__settings-btn,
			.article-compose.is-translation-mode .block-editor .ce-popover,
			.article-compose.is-translation-mode .block-editor .ce-block__settings-btn { display: none !important; pointer-events: none !important; }
			.article-compose.is-translation-mode .block-editor .ce-toolbar__actions { pointer-events: none; }
		.block-editor .ce-paragraph { line-height: 1.7; }
		.block-editor .ce-header { padding: .25em 0; }
		.block-editor .ce-toolbar__settings-btn { cursor: grab; }
		.block-editor .ce-toolbar__settings-btn:active { cursor: grabbing; }
		.block-editor .ce-block { transition: transform .18s ease, background-color .18s ease; border-radius: 8px; }
		.block-editor.is-moving .ce-block { animation: block-settle .24s ease; }
		@keyframes block-settle { 0% { background: rgba(72,124,31,.08); transform: translateY(2px); } 100% { background: transparent; transform: translateY(0); } }
		.cta-tool { display: grid; gap: 10px; padding: 18px; border-radius: 12px; color: #fff; }
		.cta-tool { background: linear-gradient(to bottom, #1a1a1e, #151518, #0a0a0c); border: 1px solid rgba(255,255,255,.05); }
		.cta-preview { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(180px, .9fr); gap: 18px; min-height: 230px; overflow: hidden; border-radius: 12px; padding: 24px; background: linear-gradient(to bottom, #1a1a1e, #151518, #0a0a0c); border: 1px solid rgba(255,255,255,.05); box-shadow: 0 10px 15px -3px rgba(0,0,0,.35); }
		.cta-preview-beams { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
		.cta-preview-beams span { position: absolute; left: -30%; width: 160%; transform: rotate(35deg); background: rgba(94,165,0,.2); filter: blur(28px); }
		.cta-preview-beams span:first-child { top: 5%; height: 80px; }
		.cta-preview-beams span:last-child { top: 30%; height: 96px; background: rgba(94,165,0,.1); filter: blur(48px); }
		.cta-preview-copy { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: center; }
		.cta-preview strong { display: block; max-width: 300px; font-size: 30px; line-height: 1.1; font-weight: 400; letter-spacing: 0; }
		.cta-preview p { max-width: 300px; color: #9ca3af; font-size: 16px; line-height: 1.625; font-weight: 200; }
		.cta-preview-copy > span { display: inline-flex; width: max-content; min-height: 42px; align-items: center; margin-top: 10px; padding: 10px 24px; border-radius: 12px; background: #5ea500; color: #fff; font-weight: 400; }
		.cta-mockup { position: relative; z-index: 1; min-height: 210px; }
		.cta-mockup-card { position: absolute; width: 220px; display: grid; grid-template-columns: 40px 1fr auto; gap: 8px; align-items: center; padding: 14px; border: 1px solid rgba(255,255,255,.1); border-radius: 16px; background: rgba(24,24,27,.95); box-shadow: 0 20px 40px -15px rgba(0,0,0,.7); }
		.cta-mockup-card-top { top: 24px; left: 0; transform: rotate(3deg); }
		.cta-mockup-card-bottom { top: 112px; right: 0; transform: rotate(-2deg); }
		.cta-mockup-card img { grid-row: span 2; width: 40px; height: 40px; border-radius: 999px; border: 1px solid rgba(255,255,255,.2); object-fit: cover; }
		.cta-mockup-card b { color: #fff; font-size: 12px; font-weight: 300; }
		.cta-mockup-card small { color: #a1a1aa; font-size: 10px; font-weight: 200; }
		.cta-mockup-card span { grid-row: span 2; align-self: center; color: #fff; font-size: 12px; background: transparent; padding: 0; min-height: 0; }
		.tldr-tool { display: grid; gap: 12px; padding: 18px; border-radius: 10px; background: #f8fbf4; border: 1px solid #cfe3bf; color: var(--ink); }
		.tldr-tool label { color: #4f5e46; font-size: 13px; font-weight: 650; }
		.tldr-tool input, .tldr-tool textarea { border-color: #cfd9c7; background: #fff; color: var(--ink); }
		.tldr-tool input::placeholder, .tldr-tool textarea::placeholder { color: #8c9585; }
		.cta-tool label { color: rgba(255,255,255,.76); }
		.cta-tool input, .cta-tool textarea { border-color: rgba(255,255,255,.22); background: rgba(255,255,255,.08); color: #fff; }
		.cta-tool input::placeholder, .cta-tool textarea::placeholder { color: rgba(255,255,255,.48); }
		.tldr-items { display: grid; gap: 10px; }
		.tldr-item { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 8px; }
		.tldr-item span { grid-column: 1 / -1; color: #4f5e46; }
		.tldr-item textarea { min-height: 78px; resize: vertical; }
		.tldr-add, .tldr-item button { min-height: 36px; background: #fff; color: var(--accent); border: 1px solid #cfe3bf; }
		.tldr-item button { padding: 0 10px; color: #5d584d; }
		.article-faq-editor { margin-top: 24px; background: var(--paper); border: 1px solid var(--line); border-radius: 8px; padding: 22px; }
		.article-faq-head { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
		.article-faq-head h2 { margin: 0; font-size: 24px; line-height: 1.2; letter-spacing: 0; }
		.article-faq-head p { margin: 0; max-width: 320px; color: var(--muted); font-size: 13px; line-height: 1.45; }
		.article-faq-list { display: grid; gap: 14px; max-width: 768px; margin: 0 auto; }
		.faq-fields { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.2fr); gap: 12px; padding: 14px; border: 1px solid var(--line); border-radius: 8px; background: #fbfaf7; }
		.faq-fields-head { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
		.faq-fields-head strong { color: var(--ink); font-size: 14px; }
		.faq-remove { min-height: 32px; padding: 0 10px; color: #6b665d; }
		.faq-fields textarea { min-height: 120px; resize: vertical; }
		.faq-add { width: min(100%, 768px); margin: 14px auto 0; color: var(--accent); }
		#body-markdown { display: none; }
		.settings-sidebar { display: grid; align-content: start; gap: var(--admin-sticky-gap); height: 100%; overflow-y: auto; padding-top: 0; padding-bottom: 56px; }
		.settings-group { background: var(--paper); border: 1px solid var(--line); border-radius: 8px; padding: 16px; }
		.settings-group h2 { margin: 0 0 14px; font-size: 13px; line-height: 1; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
		.settings-group.is-locked { background: #f4f1eb; color: #8f887d; }
		.settings-group.is-locked input,
		.settings-group.is-locked select,
		.settings-group.is-locked textarea { background: #eeeae2; color: #6b665d; cursor: not-allowed; opacity: .86; }
		.settings-group.is-locked .check { color: #8f887d; cursor: not-allowed; }
		.settings-group.is-locked .check input { cursor: not-allowed; }
		.locked-note { margin: -6px 0 10px; color: #8f887d; font-size: 12px; line-height: 1.35; }
		label { display: grid; gap: 7px; color: #555; font-size: 14px; font-weight: 560; }
		input, textarea, select { width: 100%; background: #fff; color: var(--ink); border: 1px solid #d9d6ce; border-radius: 7px; padding: 10px 12px; font: inherit; }
		input:focus, textarea:focus, select:focus { outline: 2px solid rgba(72,124,31,.22); border-color: var(--accent); }
		textarea { min-height: 96px; } textarea.body { min-height: 420px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
		.seo-setting { display: grid; gap: 8px; margin-top: 12px; }
		.seo-setting-head { display: inline-flex; align-items: center; gap: 8px; color: #4f4a42; font-size: 13px; font-weight: 650; }
		.seo-setting-head input { width: 14px; height: 14px; margin: 0; accent-color: var(--accent); }
		.seo-setting input:disabled, .seo-setting textarea:disabled { background: #f5f4ef; color: #8c887e; }
		.og-preview { display: grid; min-height: 92px; place-items: center; overflow: hidden; border: 1px dashed #d6d2c8; border-radius: 8px; background: #fbfaf7; color: #7a7469; font-size: 12px; text-align: center; }
		.og-preview.has-image { display: block; position: relative; min-height: 120px; border-style: solid; background: #f1f0ec; }
		.og-preview img { display: block; width: 100%; aspect-ratio: 1.91 / 1; object-fit: cover; }
		.og-preview span { display: block; max-width: 100%; overflow: hidden; padding: 8px 10px; text-overflow: ellipsis; white-space: nowrap; }
		.og-preview.has-image span { position: absolute; left: 8px; top: 8px; max-width: calc(100% - 16px); border-radius: 999px; background: rgba(255,255,255,.78); backdrop-filter: blur(10px); }
		.og-actions { display: flex; flex-wrap: wrap; gap: 8px; }
		.og-actions button { min-height: 34px; padding: 0 12px; font-size: 12px; font-weight: 560; }
		.secondary { background: #fff; color: var(--ink); border: 1px solid var(--line); }
		.standalone { margin-top: 8px; } .muted { color: var(--muted); }
		table { width: 100%; border-collapse: collapse; } th, td { padding: 13px 10px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
		th { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }
		td span { display: block; color: var(--muted); font-size: 12px; margin-top: 4px; } tr:last-child td { border-bottom: 0; }
		.row-link { font-weight: 650; text-decoration: none; } .text-link { color: var(--accent); font-weight: 650; text-decoration: none; }
			.status { display: inline-flex; margin: 0; padding: 4px 8px; border-radius: 99px; background: #ece9e2; color: #5d584d; font-size: 12px; }
			.status.published { background: #e7f2dd; color: #365f19; }
			.check { display: inline-flex; grid-template-columns: auto 1fr; align-items: center; margin-right: 12px; } .check input { width: auto; }
			.preview-list { display: grid; gap: 10px; max-width: 720px; }
			.preview-list a { display: grid; gap: 4px; padding: 14px; border: 1px solid var(--line); border-radius: 8px; text-decoration: none; }
			.preview-list a:hover { border-color: var(--accent); }
			.preview-list span { color: var(--muted); font-size: 13px; }
			@media (max-width: 980px) { .main:has(.article-compose) { overflow-y: auto; padding-bottom: 56px; } .article-compose { height: auto; grid-template-columns: 1fr; overflow: visible; } .article-canvas, .settings-sidebar { height: auto; overflow: visible; padding-bottom: 0; } .page-actions { position: static; grid-template-columns: 1fr; } }
		@media (max-width: 760px) { .admin-layout { grid-template-columns: 1fr; } .sidebar { position: static; } .sidebar-footer { position: static; margin: 24px 8px 0; } .main { padding: 22px 16px 40px; } .page-head, .article-faq-head { align-items: start; flex-direction: column; } .cover-actions { flex-direction: column; } .faq-fields { grid-template-columns: 1fr; } }
	</style>
</head>
<body>${body}</body>
</html>`, { headers: { 'Cache-Control': 'no-store' } });
}

function adminShell(title: string, active: 'articles' | 'authors' | 'categories' | 'media' | 'preview', email: string, content: string): Response {
	const nav = [
		['articles', 'Articles', '/admin/blog'],
		['authors', 'Authors', '/admin/blog/authors'],
		['categories', 'Categories', '/admin/blog/categories'],
		['media', 'Media', '/admin/blog/media'],
		['preview', 'Design preview', '/admin/blog/design-preview'],
	] as const;
	return adminHtml(title, `<div class="admin-layout">
		<aside class="sidebar">
			<div class="brand"><strong>Garna Blog</strong><span>Admin</span></div>
			<div class="create-row">
				<a class="button" href="/admin/blog/articles/new">Create</a>
				<details>
					<summary aria-label="Open create menu"><span class="chevron">⌄</span></summary>
					<div class="create-menu">
						<a href="/admin/blog/authors/new">New author</a>
						<a href="/admin/blog/categories/new">New category</a>
						<a href="/admin/blog/media/new">Upload media</a>
					</div>
				</details>
			</div>
			<nav class="nav">${nav.map(([key, label, href]) => `<a class="${active === key ? 'active' : ''}" href="${href}">${label}</a>`).join('')}</nav>
			<div class="sidebar-footer"><div>${escapeHtml(email)}</div><a href="/admin/blog/logout">Log out</a></div>
		</aside>
		<main class="main">${content}</main>
	</div>`);
}
