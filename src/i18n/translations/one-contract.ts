import { homeTranslations } from './home';
import { oneContractEs } from './one-contract/es';
import { oneContractPt } from './one-contract/pt';
import { oneContractRu } from './one-contract/ru';

const pageContent = {
	meta: {
		title: 'One Contract with Garna Instead of Hundreds with Contractors',
		description: 'One contract with Garna, one consolidated invoice, and documents for every contractor in one dashboard.',
	},
	hero: {
		title: 'One contract with Garna\ninstead of hundreds with contractors',
		description: 'Garna contracts with each professional in 150+ countries. You sign one agreement and receive one consolidated invoice with all supporting documents',
		cta: 'Book a demo',
		note: 'See the dashboard and get a tailored estimate for your team',
		cards: {
			compliance: { note: 'Agreement', role: 'Contractor, Portugal', value: 'Signed' },
			agreement: { label: 'One active agreement', value: '50 contractors covered', note: 'Your entire contractor team' },
		},
		stats: {
			ariaLabel: 'Garna in numbers', companies: 'companies', countries: 'countries',
			professionals: 'professionals', support: 'support',
		},
	},
	comparison: {
		kicker: 'Before / after',
		title: 'What changes when you work with more than 10 contractors',
		description: 'See the difference for an international team of 50 contractors',
		ariaLabel: 'Current contractor management compared with Garna',
		before: 'Now', after: 'With Garna',
		rows: {
			r1: { label: 'Agreements', before: '50 contracts under different templates and laws', after: '1 contract with Garna' },
			r2: { label: 'Invoices', before: '50 invoices in different formats', after: '1 consolidated invoice' },
			r3: { label: 'Documents', before: 'Documents collected manually', after: 'Documents for every contractor in one dashboard' },
			r4: { label: 'Compliance', before: 'Compliance reviewed in-house', after: 'Compliance managed by Garna' },
		},
	},
	process: {
		kicker: 'A simple process', title: 'How one contract replaces dozens of workflows',
		steps: {
			s1: { title: 'Sign one contract', description: 'Your company enters into one agreement with Garna' },
			s2: { title: 'Invite your team', description: 'Add contractors to the dashboard while Garna handles onboarding and contracts with each of them' },
			s3: { title: 'Approve the work', description: 'Contractors submit invoices and you approve the results in one interface' },
			s4: { title: 'Receive your documents', description: 'Replace dozens of scattered files with one invoice and a complete document package for the period' },
		},
		carousel: {
			agreement: { label: 'Agreement', value: 'One contract', reviewLabel: 'Review', reviewValue: 'Complete', footerTitle: 'Ready to sign' },
			invite: { name: 'Elena Rossi', status: 'Joined your team', badge: 'Active' },
			approve: { period: 'May 2026', title: 'Approval in progress', meta: '8 of 12 contractors reviewed' },
			documents: { time: 'Just now', title: 'Document package ready', description: 'Invoice and completion records' },
		},
	},
	documents: {
		kicker: 'For finance teams', title: 'Documents that are easy to review',
		description: 'No email archives or inconsistently named files. Every document is organized by period and contractor',
		cta: 'Explore the dashboard',
		items: {
			i1: { title: 'Garna service agreement', description: 'One point of contact for your company.', tags: ['One agreement', 'One partner', 'Easy to review'] },
			i2: { title: 'One consolidated invoice', description: 'Every contractor included in one document for the period.', tags: ['One invoice', 'One period', 'All contractors'] },
			i3: { title: 'Team register', description: 'A clear breakdown of your team and completed work.', tags: ['Team overview', 'Clear breakdown', 'One dashboard'] },
			i4: { title: 'Work completion records', description: 'Documents for every contractor are available in the dashboard.', tags: ['By contractor', 'Organized files', 'Ready to review'] },
		},
	},
	risk: {
		kicker: 'Risks under control', title: 'An international team without the legal maze',
		description: 'Keep contractor classification, intellectual property, and international expansion organized in one compliant setup',
		items: {
			i1: { title: 'Contractor status', description: 'Engagements follow local requirements to help reduce misclassification risk' },
			i2: { title: 'Rights to deliverables', description: 'Intellectual property transfer terms are documented clearly' },
			i3: { title: 'No new entities', description: 'Work with a distributed team without opening a company in every country' },
		},
		visuals: {
			status: { name: 'Sarah Miller', role: 'Verified contractor', badge: 'Compliant' },
			rights: { eyebrow: 'IP assignment agreement', contractor: 'Contractor', client: 'Client', signature: 'Signature' },
			globe: { spain: 'Spain team connected', kenya: 'Kenya team active' },
		},
	},
	audience: {
		kicker: 'Who it is for', title: 'Built for teams with 10+ contractors across countries',
		items: {
			i1: { title: 'SaaS and IT products', description: 'Distributed development, design, and marketing teams' },
			i2: { title: 'Agencies', description: 'Many project-based specialists and recurring paperwork' },
			i3: { title: 'Marketplaces', description: 'A large network of independent contractors across countries' },
			i4: { title: 'Startups', description: 'An international team without opening local entities' },
		},
	},
	faq: {
		title: 'The essentials, answered',
		subtitle: 'If your question is not listed, we will cover it during the demo',
		items: {
			q1: { question: 'What is Contractor of Record in simple terms?', answer: 'It is a model in which Garna contracts with independent professionals while your company works through one agreement and one dashboard.' },
			q2: { question: 'How do we move our current contractors to Garna?', answer: 'The Garna team helps collect the required information, invite contractors, and complete onboarding without interrupting ongoing work.' },
			q3: { question: 'How much does it cost?', answer: 'Pricing depends on the number of contractors and your team structure. During the demo, we prepare an estimate for your scenario.' },
			q4: { question: 'Which documents does our finance team receive?', answer: 'The dashboard includes your Garna agreement, a consolidated invoice, a contractor register, and completion records. The exact package depends on your setup.' },
			q5: { question: 'How long does onboarding take?', answer: 'Timing depends on the number of contractors and countries involved. During the demo, we assess your team and suggest a transition plan.' },
			q6: { question: 'Where can our contractors be located?', answer: 'Garna supports contractors in more than 150 countries. We confirm availability for your specific setup during the demo.' },
		},
	},
	demo: {
		kicker: 'Next step', title: 'See how to move your contractors to one agreement',
		description: 'Complete the short form to view available times in our calendar',
	},
	finalCta: {
		title: 'One Contract for Your Entire Global Contractor Team',
		description: 'Bring contracts, invoices, approvals, and contractor documents together in one clear workflow',
		button: 'Book a demo',
	},
};

const english = {
	...homeTranslations.en,
	...pageContent,
	bookingWidget: {
		...homeTranslations.en.bookingWidget,
		title: 'Book a demo', subtitle: 'Enter your details to choose a time',
		form: { ...homeTranslations.en.bookingWidget.form, employees: 'How many contractors do you have abroad?*' },
		companySizeOptions: ['Fewer than 10', '10–24', '25–49', '50–99', '100+'],
		signUp: { promptPrefix: 'The calendar will open right after the form', linkText: '', promptSuffix: '' },
	},
};

const buildLocale = (locale: 'es' | 'pt' | 'ru', content: typeof oneContractEs) => ({
	...homeTranslations[locale],
	...content,
	bookingWidget: {
		...homeTranslations[locale].bookingWidget,
		...content.bookingWidget,
		form: { ...homeTranslations[locale].bookingWidget.form, ...content.bookingWidget.form },
		signUp: { ...homeTranslations[locale].bookingWidget.signUp, ...content.bookingWidget.signUp },
	},
});

export const oneContractTranslations = {
	en: english,
	es: buildLocale('es', oneContractEs),
	pt: buildLocale('pt', oneContractPt),
	ru: buildLocale('ru', oneContractRu),
};
