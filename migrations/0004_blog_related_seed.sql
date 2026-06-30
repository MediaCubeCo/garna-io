INSERT OR IGNORE INTO articles (
	slug,
	title,
	excerpt,
	body_markdown,
	status,
	author_id,
	cover_url,
	cover_alt,
	read_time_minutes,
	seo_title,
	seo_description,
	og_image_url,
	canonical_path,
	published_at
)
SELECT
	'payroll-approval-workflows',
	'Designing Payroll Approval Workflows That Do Not Slow Teams Down',
	'How to structure approvals, exceptions, evidence, and payment cutoffs for global payroll teams.',
	'## Start with decision ownership

Payroll approvals become faster when every decision has a clear owner. Separate routine approvals from exceptions, and make the expected evidence visible before the payroll cycle starts.

## Keep exceptions visible

Exception handling should not live in chat threads. Teams need queues, timestamps, and simple reasons for why an item is blocked.

## Measure the cycle

Approval cycle time, late approvals, and repeated correction types show where the operating model needs improvement.',
	'published',
	authors.id,
	'/pages/blog/assets/17-photo-1504868584819-f8e8b4b6d7e3.jpg',
	'Team reviewing approval workflow dashboards',
	7,
	'Designing Payroll Approval Workflows | Garna',
	'How to structure approvals, exceptions, evidence, and payment cutoffs for global payroll teams.',
	'/pages/blog/assets/17-photo-1504868584819-f8e8b4b6d7e3.jpg',
	'/en/blog/payroll-approval-workflows',
	'2026-06-24T00:00:00.000Z'
FROM authors
WHERE authors.slug = 'emily-chen';

INSERT OR IGNORE INTO articles (
	slug,
	title,
	excerpt,
	body_markdown,
	status,
	author_id,
	cover_url,
	cover_alt,
	read_time_minutes,
	seo_title,
	seo_description,
	og_image_url,
	canonical_path,
	published_at
)
SELECT
	'contractor-payment-reliability',
	'Making Contractor Payments Reliable Across Countries',
	'Practical ways to reduce failed payouts, missing bank details, and unclear payment status.',
	'## Make payment constraints explicit

Every market has its own constraints: currencies, banking formats, wallet availability, holidays, and compliance checks. Reliable payout operations expose those constraints before payday.

## Communicate status clearly

Contractors should not need to ask five people where a payment is. They need clear status, expected dates, and support paths.

## Reconcile every cycle

Payment operations are complete only when exceptions are resolved, reports are stored, and the next cycle starts from clean data.',
	'published',
	authors.id,
	'/pages/blog/assets/18-photo-1551288049-bebda4e38f71.jpg',
	'Contractor payment operations dashboard',
	6,
	'Making Contractor Payments Reliable | Garna',
	'Practical ways to reduce failed payouts, missing bank details, and unclear payment status.',
	'/pages/blog/assets/18-photo-1551288049-bebda4e38f71.jpg',
	'/en/blog/contractor-payment-reliability',
	'2026-06-23T00:00:00.000Z'
FROM authors
WHERE authors.slug = 'emily-chen';

INSERT OR IGNORE INTO article_categories (article_id, category_id)
SELECT articles.id, categories.id
FROM articles, categories
WHERE articles.slug IN ('payroll-approval-workflows', 'contractor-payment-reliability') AND categories.slug = 'payroll';

INSERT OR IGNORE INTO article_faqs (article_id, question, answer, position)
SELECT articles.id, faq.question, faq.answer, faq.position
FROM articles
JOIN (
	SELECT 'What should payroll approval workflows include?' AS question, 'They should include clear owners, cutoff dates, evidence requirements, exception reasons, and an audit trail for each decision.' AS answer, 0 AS position
	UNION ALL SELECT 'How do teams reduce late approvals?', 'Teams reduce late approvals by separating routine approvals from exceptions and making blockers visible before the payment batch is locked.', 1
	UNION ALL SELECT 'Why does approval evidence matter?', 'Evidence helps teams explain decisions later, support compliance reviews, and reduce repeated manual follow-up during each payroll cycle.', 2
) AS faq
WHERE articles.slug = 'payroll-approval-workflows';

INSERT OR IGNORE INTO article_faqs (article_id, question, answer, position)
SELECT articles.id, faq.question, faq.answer, faq.position
FROM articles
JOIN (
	SELECT 'Why do contractor payments fail?' AS question, 'They often fail because of missing bank details, unsupported payment rails, currency constraints, compliance checks, or local holidays.' AS answer, 0 AS position
	UNION ALL SELECT 'How can payout status be clearer?', 'Teams should show the payment stage, expected date, required action, and support path in one place instead of relying on chat updates.', 1
	UNION ALL SELECT 'When is a payout cycle complete?', 'A cycle is complete when payments are reconciled, failed items are resolved, reports are stored, and the next cycle starts from clean data.', 2
) AS faq
WHERE articles.slug = 'contractor-payment-reliability';
