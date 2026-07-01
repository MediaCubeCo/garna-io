interface Env {
	ASSETS: Fetcher;
	USE_STATIC_ASSETS: string;
	DB: D1Database;
	BLOG_MEDIA: R2Bucket;
	EMAIL: SendEmail;
	ADMIN_EMAILS?: string;
	SESSION_SECRET?: string;
	MAGIC_LINK_SECRET?: string;
	PUBLIC_ORIGIN?: string;
	EMAIL_FROM?: string;
	DEV_SHOW_MAGIC_LINK?: string;
}
