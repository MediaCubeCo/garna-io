ALTER TABLE authors ADD COLUMN avatar_object_position TEXT;
ALTER TABLE authors ADD COLUMN avatar_crop_scale REAL;

CREATE TABLE IF NOT EXISTS author_translations (
	author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
	language TEXT NOT NULL,
	name TEXT,
	role TEXT,
	bio TEXT,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (author_id, language)
);

CREATE INDEX IF NOT EXISTS idx_author_translations_language ON author_translations(language);
