import type { BlogArticle, BlogArticleFaq, BlogArticleInput, BlogAuthor, BlogCategory, BlogEnv, BlogMediaAsset } from './types';

const articleSelect = `
	SELECT
		articles.*,
		authors.id AS author_id_value,
		authors.slug AS author_slug,
		authors.name AS author_name,
		authors.role AS author_role,
		authors.bio AS author_bio,
		authors.avatar_url AS author_avatar_url,
		authors.avatar_alt AS author_avatar_alt,
		authors.email AS author_email,
		authors.x_url AS author_x_url,
		authors.linkedin_url AS author_linkedin_url
	FROM articles
	JOIN authors ON authors.id = articles.author_id
`;

function rowToArticle(row: any): BlogArticle {
	return {
		id: row.id,
		language: row.language || 'en',
		slug: row.slug,
		title: row.title,
		excerpt: row.excerpt,
		body_markdown: row.body_markdown,
		status: row.status,
		author_id: row.author_id,
		cover_url: row.cover_url,
		cover_alt: row.cover_alt,
		cover_object_position: row.cover_object_position,
		related_object_position: row.related_object_position,
		cover_crop_scale: row.cover_crop_scale,
		related_crop_scale: row.related_crop_scale,
		read_time_minutes: row.read_time_minutes,
		seo_title: row.seo_title,
		seo_description: row.seo_description,
		og_image_url: row.og_image_url,
		canonical_path: row.canonical_path,
		published_at: row.published_at,
		updated_at: row.updated_at,
		author: {
			id: row.author_id_value,
			slug: row.author_slug,
			name: row.author_name,
			role: row.author_role,
			bio: row.author_bio,
			avatar_url: row.author_avatar_url,
			avatar_alt: row.author_avatar_alt,
			email: row.author_email,
			x_url: row.author_x_url,
			linkedin_url: row.author_linkedin_url,
		},
	};
}

async function attachCategories(env: BlogEnv, article: BlogArticle): Promise<BlogArticle> {
	if (!env.DB) return article;
	const { results } = await env.DB.prepare(
		`SELECT categories.*
		 FROM categories
		 JOIN article_categories ON article_categories.category_id = categories.id
		 WHERE article_categories.article_id = ?
		 ORDER BY categories.name ASC`
	)
		.bind(article.id)
		.all<BlogCategory>();
	return { ...article, categories: results || [] };
}

async function attachFaqs(env: BlogEnv, article: BlogArticle): Promise<BlogArticle> {
	if (!env.DB) return article;
	const { results } = await env.DB.prepare(
		`SELECT *
		 FROM article_faqs
		 WHERE article_id = ?
		 ORDER BY position ASC, id ASC`
	)
		.bind(article.id)
		.all<BlogArticleFaq>();
	return { ...article, faqs: results || [] };
}

async function attachTranslationFaqs(env: BlogEnv, article: BlogArticle, language: string): Promise<BlogArticle> {
	if (!env.DB || language === 'en') return article;
	const { results } = await env.DB.prepare(
		`SELECT id, article_id, question, answer, position
		 FROM article_translation_faqs
		 WHERE article_id = ? AND language = ?
		 ORDER BY position ASC, id ASC`
	)
		.bind(article.id, language)
		.all<BlogArticleFaq>();
	return results?.length ? { ...article, faqs: results } : article;
}

async function attachArticleRelations(env: BlogEnv, article: BlogArticle): Promise<BlogArticle> {
	return attachFaqs(env, await attachCategories(env, article));
}

async function overlayArticleTranslation(env: BlogEnv, article: BlogArticle, language: string): Promise<BlogArticle | null> {
	if (!env.DB || language === 'en') return article;
	const translation = await env.DB.prepare(
		`SELECT *
		 FROM article_translations
		 WHERE article_id = ? AND language = ?`
	)
		.bind(article.id, language)
		.first<any>();
	if (!translation) return null;
	const translated: BlogArticle = {
		...article,
		language,
		title: translation.title,
		excerpt: translation.excerpt,
		body_markdown: translation.body_markdown,
		cover_url: translation.cover_url,
		cover_alt: translation.cover_alt,
		cover_object_position: translation.cover_object_position,
		related_object_position: translation.related_object_position,
		cover_crop_scale: translation.cover_crop_scale,
		related_crop_scale: translation.related_crop_scale,
		seo_title: translation.seo_title,
		seo_description: translation.seo_description,
		og_image_url: translation.og_image_url,
		updated_at: translation.updated_at || article.updated_at,
		canonical_path: `/${language}/blog/${article.slug}`,
	};
	return attachTranslationFaqs(env, translated, language);
}

async function overlayArticleTranslationForAdmin(env: BlogEnv, article: BlogArticle, language: string): Promise<BlogArticle> {
	if (language === 'en') return article;
	const translated = await overlayArticleTranslation(env, article, language);
	return translated || { ...article, language, canonical_path: `/${language}/blog/${article.slug}` };
}

export async function listPublishedArticles(env: BlogEnv, limit = 50, language = 'en'): Promise<BlogArticle[]> {
	if (!env.DB) return [];
	const { results } = await env.DB.prepare(
		`${articleSelect}
		 WHERE articles.status = 'published'
		   AND COALESCE(articles.language, 'en') = 'en'
		   AND articles.published_at IS NOT NULL
		   AND datetime(articles.published_at) <= datetime('now')
		   ${language === 'en' ? '' : 'AND EXISTS (SELECT 1 FROM article_translations WHERE article_translations.article_id = articles.id AND article_translations.language = ?)'}
		 ORDER BY datetime(articles.published_at) DESC, articles.id DESC
		 LIMIT ?`
	)
		.bind(...(language === 'en' ? [limit] : [language, limit]))
		.all<any>();
	const articles = await Promise.all((results || []).map(rowToArticle).map((article) => attachArticleRelations(env, article)));
	const localized = await Promise.all(articles.map((article) => overlayArticleTranslation(env, article, language)));
	return localized.filter(Boolean) as BlogArticle[];
}

export async function listArticlesForAdmin(env: BlogEnv): Promise<BlogArticle[]> {
	if (!env.DB) return [];
	const { results } = await env.DB.prepare(
		`${articleSelect}
		 ORDER BY datetime(COALESCE(articles.published_at, articles.updated_at)) DESC, articles.id DESC`
	).all<any>();
	return Promise.all((results || []).map(rowToArticle).map((article) => attachArticleRelations(env, article)));
}

export async function getPublishedArticleBySlug(env: BlogEnv, slug: string, language = 'en'): Promise<BlogArticle | null> {
	if (!env.DB) return null;
	const row = await env.DB.prepare(
		`${articleSelect}
		 WHERE articles.slug = ?
		   AND COALESCE(articles.language, 'en') = 'en'
		   AND articles.status = 'published'
		   AND articles.published_at IS NOT NULL
		   AND datetime(articles.published_at) <= datetime('now')`
	)
		.bind(slug)
		.first<any>();
	if (!row) return null;
	const article = await attachArticleRelations(env, rowToArticle(row));
	return overlayArticleTranslation(env, article, language);
}

export async function getArticleById(env: BlogEnv, id: number, language = 'en'): Promise<BlogArticle | null> {
	if (!env.DB) return null;
	const row = await env.DB.prepare(`${articleSelect} WHERE articles.id = ?`).bind(id).first<any>();
	if (!row) return null;
	const article = await attachArticleRelations(env, rowToArticle(row));
	return overlayArticleTranslationForAdmin(env, article, language);
}

export async function listPublishedArticlesByAuthor(env: BlogEnv, authorSlug: string, language = 'en'): Promise<BlogArticle[]> {
	if (!env.DB) return [];
	const { results } = await env.DB.prepare(
		`${articleSelect}
		 WHERE articles.status = 'published'
		   AND COALESCE(articles.language, 'en') = 'en'
		   AND articles.published_at IS NOT NULL
		   AND datetime(articles.published_at) <= datetime('now')
		   AND authors.slug = ?
		   ${language === 'en' ? '' : 'AND EXISTS (SELECT 1 FROM article_translations WHERE article_translations.article_id = articles.id AND article_translations.language = ?)'}
		 ORDER BY datetime(articles.published_at) DESC, articles.id DESC`
	)
		.bind(...(language === 'en' ? [authorSlug] : [authorSlug, language]))
		.all<any>();
	const articles = await Promise.all((results || []).map(rowToArticle).map((article) => attachArticleRelations(env, article)));
	const localized = await Promise.all(articles.map((article) => overlayArticleTranslation(env, article, language)));
	return localized.filter(Boolean) as BlogArticle[];
}

export async function listAuthors(env: BlogEnv): Promise<BlogAuthor[]> {
	if (!env.DB) return [];
	const { results } = await env.DB.prepare('SELECT * FROM authors ORDER BY name ASC').all<BlogAuthor>();
	return results || [];
}

export async function getAuthorBySlug(env: BlogEnv, slug: string): Promise<BlogAuthor | null> {
	if (!env.DB) return null;
	const row = await env.DB.prepare('SELECT * FROM authors WHERE slug = ?').bind(slug).first<BlogAuthor>();
	return row || null;
}

export async function listCategories(env: BlogEnv): Promise<BlogCategory[]> {
	if (!env.DB) return [];
	const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY name ASC').all<BlogCategory>();
	return results || [];
}

export async function listMediaAssets(env: BlogEnv): Promise<BlogMediaAsset[]> {
	if (!env.DB) return [];
	const { results } = await env.DB.prepare('SELECT * FROM media_assets ORDER BY datetime(created_at) DESC, id DESC').all<BlogMediaAsset>();
	return results || [];
}

export async function upsertArticle(env: BlogEnv, input: BlogArticleInput, id?: number): Promise<number> {
	if (!env.DB) throw new Error('D1 DB binding is required');
	const publishedAt = input.published_at || (input.status === 'published' ? new Date().toISOString() : null);
	if (id) {
		await env.DB.prepare(
			`UPDATE articles SET
				language = ?, slug = ?, title = ?, excerpt = ?, body_markdown = ?, status = ?, author_id = ?,
				cover_url = ?, cover_alt = ?, cover_object_position = ?, related_object_position = ?,
				cover_crop_scale = ?, related_crop_scale = ?, read_time_minutes = ?, seo_title = ?, seo_description = ?,
				og_image_url = ?, canonical_path = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
			 WHERE id = ?`
		)
			.bind(
				input.language || 'en',
				input.slug,
				input.title,
				input.excerpt,
				input.body_markdown,
				input.status,
				input.author_id,
				input.cover_url || null,
				input.cover_alt || null,
				input.cover_object_position || null,
				input.related_object_position || null,
				input.cover_crop_scale || null,
				input.related_crop_scale || null,
				input.read_time_minutes || 5,
				input.seo_title || null,
				input.seo_description || null,
				input.og_image_url || null,
				input.canonical_path || `/${input.language || 'en'}/blog/${input.slug}`,
				publishedAt,
				id
			)
			.run();
		await replaceArticleCategories(env, id, input.category_ids || []);
		await replaceArticleFaqs(env, id, input.faqs || []);
		return id;
	}

	const result = await env.DB.prepare(
		`INSERT INTO articles (
			language, slug, title, excerpt, body_markdown, status, author_id, cover_url, cover_alt,
			cover_object_position, related_object_position, cover_crop_scale, related_crop_scale,
			read_time_minutes, seo_title, seo_description, og_image_url, canonical_path, published_at
		 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	)
		.bind(
			input.language || 'en',
			input.slug,
			input.title,
			input.excerpt,
			input.body_markdown,
			input.status,
			input.author_id,
			input.cover_url || null,
			input.cover_alt || null,
			input.cover_object_position || null,
			input.related_object_position || null,
			input.cover_crop_scale || null,
			input.related_crop_scale || null,
			input.read_time_minutes || 5,
			input.seo_title || null,
			input.seo_description || null,
			input.og_image_url || null,
			input.canonical_path || `/${input.language || 'en'}/blog/${input.slug}`,
			publishedAt
		)
		.run();
	const newId = Number(result.meta.last_row_id);
	await replaceArticleCategories(env, newId, input.category_ids || []);
	await replaceArticleFaqs(env, newId, input.faqs || []);
	return newId;
}

export async function upsertArticleTranslation(env: BlogEnv, articleId: number, input: BlogArticleInput): Promise<void> {
	if (!env.DB) throw new Error('D1 DB binding is required');
	const language = input.language || 'en';
	if (language === 'en') throw new Error('English is the base article language');
	await env.DB.prepare(
		`INSERT INTO article_translations (
			article_id, language, title, excerpt, body_markdown, cover_url, cover_alt,
			cover_object_position, related_object_position, cover_crop_scale, related_crop_scale,
			seo_title, seo_description, og_image_url
		 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		 ON CONFLICT(article_id, language) DO UPDATE SET
			title = excluded.title,
			excerpt = excluded.excerpt,
			body_markdown = excluded.body_markdown,
			cover_url = excluded.cover_url,
			cover_alt = excluded.cover_alt,
			cover_object_position = excluded.cover_object_position,
			related_object_position = excluded.related_object_position,
			cover_crop_scale = excluded.cover_crop_scale,
			related_crop_scale = excluded.related_crop_scale,
			seo_title = excluded.seo_title,
			seo_description = excluded.seo_description,
			og_image_url = excluded.og_image_url,
			updated_at = CURRENT_TIMESTAMP`
	)
		.bind(
			articleId,
			language,
			input.title,
			input.excerpt,
			input.body_markdown,
			input.cover_url || null,
			input.cover_alt || null,
			input.cover_object_position || null,
			input.related_object_position || null,
			input.cover_crop_scale || null,
			input.related_crop_scale || null,
			input.seo_title || null,
			input.seo_description || null,
			input.og_image_url || null
		)
		.run();
	await replaceArticleTranslationFaqs(env, articleId, language, input.faqs || []);
}

async function replaceArticleCategories(env: BlogEnv, articleId: number, categoryIds: number[]): Promise<void> {
	if (!env.DB) return;
	await env.DB.prepare('DELETE FROM article_categories WHERE article_id = ?').bind(articleId).run();
	for (const categoryId of categoryIds) {
		await env.DB.prepare('INSERT OR IGNORE INTO article_categories (article_id, category_id) VALUES (?, ?)')
			.bind(articleId, categoryId)
			.run();
	}
}

async function replaceArticleFaqs(env: BlogEnv, articleId: number, faqs: Array<{ question: string; answer: string }>): Promise<void> {
	if (!env.DB) return;
	await env.DB.prepare('DELETE FROM article_faqs WHERE article_id = ?').bind(articleId).run();
	const cleaned = faqs
		.map((faq) => ({ question: faq.question.trim(), answer: faq.answer.trim() }))
		.filter((faq) => faq.question && faq.answer);
	for (const [index, faq] of cleaned.entries()) {
		await env.DB.prepare('INSERT INTO article_faqs (article_id, question, answer, position) VALUES (?, ?, ?, ?)')
			.bind(articleId, faq.question, faq.answer, index)
			.run();
	}
}

async function replaceArticleTranslationFaqs(env: BlogEnv, articleId: number, language: string, faqs: Array<{ question: string; answer: string }>): Promise<void> {
	if (!env.DB) return;
	await env.DB.prepare('DELETE FROM article_translation_faqs WHERE article_id = ? AND language = ?').bind(articleId, language).run();
	const cleaned = faqs
		.map((faq) => ({ question: faq.question.trim(), answer: faq.answer.trim() }))
		.filter((faq) => faq.question && faq.answer);
	for (const [index, faq] of cleaned.entries()) {
		await env.DB.prepare('INSERT INTO article_translation_faqs (article_id, language, question, answer, position) VALUES (?, ?, ?, ?, ?)')
			.bind(articleId, language, faq.question, faq.answer, index)
			.run();
	}
}

export async function upsertAuthor(env: BlogEnv, input: Partial<BlogAuthor> & { slug: string; name: string }, id?: number): Promise<number> {
	if (!env.DB) throw new Error('D1 DB binding is required');
	if (id) {
		await env.DB.prepare(
			`UPDATE authors SET slug = ?, name = ?, role = ?, bio = ?, avatar_url = ?, avatar_alt = ?,
				email = ?, x_url = ?, linkedin_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
		)
			.bind(input.slug, input.name, input.role || null, input.bio || null, input.avatar_url || null, input.avatar_alt || null, input.email || null, input.x_url || null, input.linkedin_url || null, id)
			.run();
		return id;
	}
	const result = await env.DB.prepare(
		`INSERT INTO authors (slug, name, role, bio, avatar_url, avatar_alt, email, x_url, linkedin_url)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	)
		.bind(input.slug, input.name, input.role || null, input.bio || null, input.avatar_url || null, input.avatar_alt || null, input.email || null, input.x_url || null, input.linkedin_url || null)
		.run();
	return Number(result.meta.last_row_id);
}

export async function upsertCategory(env: BlogEnv, input: Partial<BlogCategory> & { slug: string; name: string }, id?: number): Promise<number> {
	if (!env.DB) throw new Error('D1 DB binding is required');
	if (id) {
		await env.DB.prepare('UPDATE categories SET slug = ?, name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
			.bind(input.slug, input.name, input.description || null, id)
			.run();
		return id;
	}
	const result = await env.DB.prepare('INSERT INTO categories (slug, name, description) VALUES (?, ?, ?)')
		.bind(input.slug, input.name, input.description || null)
		.run();
	return Number(result.meta.last_row_id);
}
