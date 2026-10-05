CREATE TABLE IF NOT EXISTS category_translations (
	category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
	language TEXT NOT NULL,
	name TEXT,
	description TEXT,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (category_id, language)
);
