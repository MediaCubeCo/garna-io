ALTER TABLE articles ADD COLUMN language TEXT NOT NULL DEFAULT 'en';
CREATE INDEX IF NOT EXISTS idx_articles_language_status_published ON articles(language, status, published_at DESC);
