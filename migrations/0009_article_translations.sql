CREATE TABLE IF NOT EXISTS article_translations (
	article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
	language TEXT NOT NULL,
	title TEXT NOT NULL,
	excerpt TEXT NOT NULL,
	body_markdown TEXT NOT NULL,
	cover_url TEXT,
	cover_alt TEXT,
	cover_object_position TEXT,
	related_object_position TEXT,
	cover_crop_scale REAL,
	related_crop_scale REAL,
	seo_title TEXT,
	seo_description TEXT,
	og_image_url TEXT,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (article_id, language)
);

CREATE TABLE IF NOT EXISTS article_translation_faqs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
	language TEXT NOT NULL,
	question TEXT NOT NULL,
	answer TEXT NOT NULL,
	position INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_article_translations_language ON article_translations(language);
CREATE INDEX IF NOT EXISTS idx_article_translation_faqs_article_language ON article_translation_faqs(article_id, language, position);
