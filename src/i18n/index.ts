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

const translations = {
	home: homeTranslations,
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
	blog: {
		en: {
			meta: {},
			footer: homeTranslations.en.footer,
			bookingWidget: homeTranslations.en.bookingWidget,
		},
	},
} as unknown as Record<string, Record<string, AnyPageTranslations>>;

export function getPageTranslations(pageName: string, locale: string): AnyPageTranslations {
	const lang = locale.split('-')[0].toLowerCase();
	const pageTranslations = translations[pageName];

	if (!pageTranslations) {
		return translations.home.en;
	}

	return pageTranslations[lang] || pageTranslations.en;
}
