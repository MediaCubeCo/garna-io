import fs from 'node:fs';

const translationFiles = [
	'src/i18n/translations/payroll-small-business/en.ts',
	'src/i18n/translations/payroll-small-business/ru.ts',
	'src/i18n/translations/payroll-small-business/pt.ts',
	'src/i18n/translations/payroll-small-business/es.ts',
];

const targetPaths = new Set([
	'hero.description',
	'heroVisual.subtitle',
	'intro.point1.description',
	'platform.description',
	'platform.eor.title',
	'platform.eor.feature1.description',
	'platform.eor.feature2.description',
	'platform.eor.feature3.description',
	'platform.cor.title',
	'platform.cor.feature1.description',
	'platform.cor.feature2.description',
	'platform.cor.feature3.description',
	'steps.item1.description',
	'steps.item2.description',
	'steps.item3.description',
	'steps.item4.description',
	'why.description',
	'why.item1.description',
	'why.item2.description',
	'why.item3.description',
	'why.item4.description',
	'why.item5.description',
	'finalCta.description',
]);

function processTranslationFile(file) {
	const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
	const stack = [];
	const next = lines.map((line) => {
		const objectMatch = line.match(/^(\t*)([A-Za-z0-9_]+): \{$/);
		if (objectMatch) {
			const indent = objectMatch[1].length;
			stack.length = indent;
			stack[indent] = objectMatch[2];
			return line;
		}

		const valueMatch = line.match(/^(\t*)([A-Za-z0-9_]+): "([\s\S]*)"(,?)$/);
		if (!valueMatch) return line;

		const indent = valueMatch[1].length;
		stack.length = indent;
		const path = [...stack, valueMatch[2]].filter(Boolean).join('.');
		if (!targetPaths.has(path) || !valueMatch[3].endsWith('.')) return line;

		return `${valueMatch[1]}${valueMatch[2]}: "${valueMatch[3].slice(0, -1)}"${valueMatch[4]}`;
	});
	fs.writeFileSync(file, next.join('\n'), 'utf8');
}

for (const file of translationFiles) {
	processTranslationFile(file);
}

const literalFiles = [
	'astro/content/page-heroes.ts',
	'astro/content/page-final-ctas.ts',
	'astro/content/site-hero-visuals/payroll-small-business.html',
	'astro/content/site-pages/payroll-small-business.html',
];

const replacements = [
	['Hire employees and pay contractors all over the world. Everything in one platform: from taxes and contracts to one-click bulk payments.', 'Hire employees and pay contractors all over the world. Everything in one platform: from taxes and contracts to one-click bulk payments'],
	['June 2026 batch across 9 countries, employees, contractors, and local tax rules.', 'June 2026 batch across 9 countries, employees, contractors, and local tax rules'],
	['Payroll shouldn’t slow down your business growth. For small businesses, payroll can turn into chaos: endless spreadsheets, manual tax recalculations, and the fear of missing a deadline. Every hour spent on accounting and administrative work is an hour taken away from your growth.', 'Payroll shouldn’t slow down your business growth. For small businesses, payroll can turn into chaos: endless spreadsheets, manual tax recalculations, and the fear of missing a deadline. Every hour spent on accounting and administrative work is an hour taken away from your growth'],
	['We have separated the important processes to make it easier for you to manage both full-time employees and freelancers.', 'We have separated the important processes to make it easier for you to manage both full-time employees and freelancers'],
	['Full-time recruitment without creating legal entities or hiring legal and accounting consultants abroad.', 'Full-time recruitment without creating legal entities or hiring legal and accounting consultants abroad'],
	['we become the official employer for your employees in more than 150 countries.', 'we become the official employer for your employees in more than 150 countries'],
	['we handle the calculation of contributions, health insurance, and pension contributions in accordance with local laws.', 'we handle the calculation of contributions, health insurance, and pension contributions in accordance with local laws'],
	['all employment contracts and reports are executed flawlessly and are available to you at any time.', 'all employment contracts and reports are executed flawlessly and are available to you at any time'],
	['Schedule payments to team members with one click, wherever they are.', 'Schedule payments to team members with one click, wherever they are'],
	['pay via SWIFT, SEPA, or in cryptocurrency. Your performers can receive money in a convenient way.', 'pay via SWIFT, SEPA, or in cryptocurrency. Your performers can receive money in a convenient way'],
	['no more manual invoicing. The system automatically generates invoices.', 'no more manual invoicing. The system automatically generates invoices'],
	['automatic transfer of intellectual property rights to you with each payment.', 'automatic transfer of intellectual property rights to you with each payment'],
	['Create a company profile and go through a quick verification process.', 'Create a company profile and go through a quick verification process'],
	['Invite employees (EoR) or contractors (CoR) and assign them roles.', 'Invite employees (EoR) or contractors (CoR) and assign them roles'],
	['Transfer funds to your account in a convenient way.', 'Transfer funds to your account in a convenient way'],
	['One click, and the money is sent to the entire team, including all taxes.', 'One click, and the money is sent to the entire team, including all taxes'],
	['Our advantages that save you time and money.', 'Our advantages that save you time and money'],
	['Automated contracts and calculations free you from working with documentation.', 'Automated contracts and calculations free you from working with documentation'],
	['All contracts, invoices, and transactions are available in one place within the service.', 'All contracts, invoices, and transactions are available in one place within the service'],
	['Clear and transparent pricing, adapted to your budget.', 'Clear and transparent pricing, adapted to your budget'],
	['Launch mass payouts automatically as your business grows.', 'Launch mass payouts automatically as your business grows'],
	['Our personal team of experts is always in touch with you and your team.', 'Our personal team of experts is always in touch with you and your team'],
	['Optimize your payroll and focus on business growth today. Join thousands of popular companies that have already automated their global payouts.', 'Optimize your payroll and focus on business growth today. Join thousands of popular companies that have already automated their global payouts'],
];

for (const file of literalFiles) {
	let content = fs.readFileSync(file, 'utf8');
	for (const [from, to] of replacements) {
		content = content.replaceAll(from, to);
	}
	fs.writeFileSync(file, content, 'utf8');
}
