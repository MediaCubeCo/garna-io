export interface BlogEnv {
	ASSETS?: Fetcher;
	DB?: D1Database;
	BLOG_MEDIA?: R2Bucket;
	EMAIL?: SendEmail;
	ADMIN_EMAILS?: string;
	SESSION_SECRET?: string;
	MAGIC_LINK_SECRET?: string;
	PUBLIC_ORIGIN?: string;
	EMAIL_FROM?: string;
	DEV_SHOW_MAGIC_LINK?: string;
}

export interface BlogAuthor {
	id: number;
	slug: string;
	name: string;
	role: string | null;
	bio: string | null;
	avatar_url: string | null;
	avatar_alt: string | null;
	avatar_object_position: string | null;
	avatar_crop_scale: number | null;
	email: string | null;
	x_url: string | null;
	linkedin_url: string | null;
}

export interface BlogCategory {
	id: number;
	slug: string;
	name: string;
	description: string | null;
}

export interface BlogMediaAsset {
	id: number;
	key: string;
	url: string;
	display_name?: string | null;
	alt: string | null;
	content_type: string | null;
	size_bytes: number | null;
	created_at: string;
}

export interface BlogArticleFaq {
	id: number;
	article_id: number;
	question: string;
	answer: string;
	position: number;
}

export interface BlogArticle {
	id: number;
	language: string;
	slug: string;
	title: string;
	excerpt: string;
	body_markdown: string;
	status: 'draft' | 'published';
	author_id: number;
	cover_url: string | null;
	cover_alt: string | null;
	cover_object_position: string | null;
	related_object_position: string | null;
	cover_crop_scale: number | null;
	related_crop_scale: number | null;
	read_time_minutes: number;
	seo_title: string | null;
	seo_description: string | null;
	og_image_url: string | null;
	canonical_path: string | null;
	published_at: string | null;
	updated_at: string;
	author?: BlogAuthor;
	categories?: BlogCategory[];
	faqs?: BlogArticleFaq[];
}

export interface BlogArticleInput {
	language: string;
	slug: string;
	title: string;
	excerpt: string;
	body_markdown: string;
	status: 'draft' | 'published';
	author_id: number;
	cover_url?: string | null;
	cover_alt?: string | null;
	cover_object_position?: string | null;
	related_object_position?: string | null;
	cover_crop_scale?: number | null;
	related_crop_scale?: number | null;
	read_time_minutes?: number;
	seo_title?: string | null;
	seo_description?: string | null;
	og_image_url?: string | null;
	canonical_path?: string | null;
	published_at?: string | null;
	category_ids?: number[];
	faqs?: Array<{ question: string; answer: string }>;
}

export interface AdminSession {
	email: string;
	expires_at: string;
}
