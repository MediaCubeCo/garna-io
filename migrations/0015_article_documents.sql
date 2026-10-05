ALTER TABLE articles ADD COLUMN body_document TEXT;

ALTER TABLE article_translations ADD COLUMN body_document TEXT;
ALTER TABLE article_translations ADD COLUMN source_content_hash TEXT;
ALTER TABLE article_translations ADD COLUMN source_structure_hash TEXT;
ALTER TABLE article_translations ADD COLUMN status TEXT NOT NULL DEFAULT 'published'
	CHECK (status IN ('published', 'source_updated', 'structure_outdated'));

CREATE TABLE IF NOT EXISTS article_translation_drafts (
	article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
	language TEXT NOT NULL,
	title TEXT NOT NULL DEFAULT '',
	excerpt TEXT NOT NULL DEFAULT '',
	body_document TEXT NOT NULL,
	cover_url TEXT,
	cover_alt TEXT,
	cover_object_position TEXT,
	related_object_position TEXT,
	cover_crop_scale REAL,
	related_crop_scale REAL,
	seo_title TEXT,
	seo_description TEXT,
	og_image_url TEXT,
	faqs_json TEXT NOT NULL DEFAULT '[]',
	source_content_hash TEXT NOT NULL,
	source_structure_hash TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (article_id, language)
);

CREATE INDEX IF NOT EXISTS idx_article_translation_drafts_language
	ON article_translation_drafts(language, article_id);
