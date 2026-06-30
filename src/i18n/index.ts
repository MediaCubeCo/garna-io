import { homeTranslations } from './translations/home';
import { offerTranslations } from './translations/offer';
import { notFoundTranslations } from './translations/404';
import { formTranslations } from './translations/form';
import { aiHiringTranslations } from './translations/ai-hiring';
import { whiteLabelTranslations } from './translations/white-label';
import { eorTranslations } from './translations/eor';
import { payrollSmallBusinessTranslations } from './translations/payroll-small-business';
import { payrollSolutionNewTranslations } from './translations/payroll-solution-new';
import { midSizeTranslations } from './translations/mid-size';

export type PageTranslations = typeof homeTranslations.en;

type AnyPageTranslations =
	| typeof homeTranslations.en
	| typeof offerTranslations.en
	| typeof notFoundTranslations.en
	| typeof formTranslations.en
	| typeof aiHiringTranslations.en
	| typeof whiteLabelTranslations.en
	| typeof eorTranslations.en
	| typeof payrollSmallBusinessTranslations.en
	| typeof payrollSolutionNewTranslations.en
	| typeof midSizeTranslations.en;

const blogMetaTranslations = {
	en: {
		meta: {
			title: 'Global Hiring & Payroll Insights | Garna Blog',
			description:
				'Discover expert articles, practical guides, industry trends, and compliance updates on global employment. Hire, pay, and manage international teams with ease.',
		},
		footer: homeTranslations.en.footer,
		bookingWidget: homeTranslations.en.bookingWidget,
	},
	es: {
		meta: {
			title: 'Perspectivas sobre contratación global y nómina | Blog de Garna',
			description:
				'Descubre artículos de expertos, guías prácticas, tendencias del sector y novedades de cumplimiento sobre empleo global. Contrata, paga y gestiona equipos internacionales con facilidad.',
		},
		footer: homeTranslations.es.footer,
		bookingWidget: homeTranslations.es.bookingWidget,
	},
	pt: {
		meta: {
			title: 'Insights sobre contratação global e folha de pagamento | Blog da Garna',
			description:
				'Descubra artigos de especialistas, guias práticos, tendências do setor e atualizações de compliance sobre emprego global. Contrate, pague e gerencie equipes internacionais com facilidade.',
		},
		footer: homeTranslations.pt.footer,
		bookingWidget: homeTranslations.pt.bookingWidget,
	},
	ru: {
		meta: {
			title: 'Глобальный найм и выплаты: инсайты | Блог Garna',
			description:
				'Читайте экспертные статьи, практические руководства, отраслевые тренды и обновления по комплаенсу в сфере глобального трудоустройства. Нанимайте, оплачивайте и управляйте международными командами с легкостью.',
		},
		footer: homeTranslations.ru.footer,
		bookingWidget: homeTranslations.ru.bookingWidget,
	},
};

const enterprisePayrollTranslations = {
	...homeTranslations,
	en: {
		...homeTranslations.en,
		hero: {
			...homeTranslations.en.hero,
			title: 'Scaling Payroll Infrastructure Made for Global Businesses',
			description:
				'A centralized global payroll system designed to handle operations across countries, different entities, contractors and employees without sacrificing any flexibility',
			bookDemo: 'Try Garna',
			cta: 'Try Garna',
		},
		howTo: {
			...homeTranslations.en.howTo,
			title: 'How Payroll Works: 4 Simple Steps',
			description:
				"For big companies, getting payroll right without facing errors is a major challenge. That's why we invented a system of several simple steps to make",
			steps: {
				...homeTranslations.en.howTo.steps,
				step1: {
					...homeTranslations.en.howTo.steps.step1,
					title: 'Set Up Your Team and Payroll Structure',
					description:
						'Get your company set up with a bank account, assign roles to your payroll team, bring on board any new employees & contractors, and sort out all the entities and teams you need',
				},
				step2: {
					...homeTranslations.en.howTo.steps.step2,
					title: 'Automate Calculations and Compliance',
					description: 'Connect your dashboard via API and automate payroll tasks',
				},
				step3: {
					...homeTranslations.en.howTo.steps.step3,
					title: 'Run Payroll and Global Payments',
					description:
						'Sort out funding and send payments to all your employees and contractors worldwide via payout methods from local bank transfers to SWIFT, SEPA, local bank transfers, PayPal, Payoneer or crypto',
				},
				step4: {
					...homeTranslations.en.howTo.steps.step4,
					title: 'Track, Report, and Scale',
					description:
						'Control payroll operations through a simple-to-use dashboard, access to real-time reporting and analytics, track down the cost of your workforce in every region',
				},
			},
		},
		solutions: {
			title: 'Garna Solutions for Enterprises',
			contractors: {
				title: 'Pay Global Contractors in 3 Clicks',
				description:
					"With Garna, you can cut administrative costs and manage contractor onboarding, invoicing, and compliance regulations. Get their pay out to them with ease, no matter where they're based or how many of them you have. API payments set up lets enterprises automate contractor payouts straight from their own system",
			},
			employees: {
				title: 'Hire Employees Worldwide',
				description:
					"No need to open up local offices in different countries just to get the right people on board. That's where the employer of record superstructure comes at hand. This lets you hire people across the world while all the usual employer duties get taken care of: payroll, compliance, taxes, and the local employment rules",
			},
		},
	},
};

const translations = {
	home: homeTranslations,
	'enterprise-payroll': enterprisePayrollTranslations,
	'mid-size': midSizeTranslations,
	offer: offerTranslations,
	'404': notFoundTranslations,
	form: formTranslations,
	'ai-hiring': aiHiringTranslations,
	'white-label': whiteLabelTranslations,
	eor: eorTranslations,
	'employer-of-record': eorTranslations,
	'payroll-small-business': payrollSmallBusinessTranslations,
	'payroll-solution-new': payrollSolutionNewTranslations,
	blog: blogMetaTranslations,
	'blog-author': blogMetaTranslations,
	'blog-article': blogMetaTranslations,
} as unknown as Record<string, Record<string, AnyPageTranslations>>;

export function getPageTranslations(pageName: string, locale: string): AnyPageTranslations {
	const lang = locale.split('-')[0].toLowerCase();
	const pageTranslations = translations[pageName];

	if (!pageTranslations) {
		return translations.home.en;
	}

	return pageTranslations[lang] || pageTranslations.en;
}
