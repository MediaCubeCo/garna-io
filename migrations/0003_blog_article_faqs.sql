CREATE TABLE IF NOT EXISTS article_faqs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
	question TEXT NOT NULL,
	answer TEXT NOT NULL,
	position INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_article_faqs_article_position ON article_faqs(article_id, position);

INSERT OR IGNORE INTO article_faqs (article_id, question, answer, position)
SELECT articles.id, faq.question, faq.answer, faq.position
FROM articles
JOIN (
	SELECT
		'What makes global payroll complex?' AS question,
		'Global payroll becomes complex when country rules, onboarding documents, payment rails, approvals, and reconciliation all change by market. The work is manageable when each step has clear ownership and repeatable evidence.' AS answer,
		0 AS position
	UNION ALL
	SELECT
		'How can teams reduce payroll delays?',
		'Teams reduce delays by documenting local rules before hiring volume grows, keeping source data clean, separating routine approvals from exceptions, and communicating payment status before people need to ask.',
		1
	UNION ALL
	SELECT
		'When should a company use partners for payroll?',
		'Partners help when local compliance, tax filings, payment rails, or employment setup require specialist coverage. The internal team still needs ownership of data quality, approval logic, worker communication, and reconciliation.',
		2
) AS faq
WHERE articles.slug = 'global-payroll-complexity';
