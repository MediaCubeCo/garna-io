import { homeTranslations } from './translations/home';
import { offerTranslations } from './translations/offer';
import { notFoundTranslations } from './translations/404';
import { formTranslations } from './translations/form';
import { aiHiringTranslations } from './translations/ai-hiring';
import { whiteLabelTranslations } from './translations/white-label';
import { eorTranslations } from './translations/eor';
import { payrollSmallBusinessTranslations } from './translations/payroll-small-business';
import { midSizeTranslations } from './translations/mid-size';
import { payrollSolutionNewTranslations } from './translations/payroll-solution-new';
import { blogArticleTranslations, blogAuthorTranslations, blogTranslations } from './translations/blog';
import { enterprisePayrollTranslations } from './translations/enterprise-payroll';

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
	| typeof midSizeTranslations.en
	| typeof payrollSolutionNewTranslations.en
	| typeof enterprisePayrollTranslations.en
	| typeof blogTranslations.en
	| typeof blogAuthorTranslations.en
	| typeof blogArticleTranslations.en;

const translations = {
	home: homeTranslations,
	offer: offerTranslations,
	'404': notFoundTranslations,
	form: formTranslations,
	'ai-hiring': aiHiringTranslations,
	'white-label': whiteLabelTranslations,
	eor: eorTranslations,
	'employer-of-record': eorTranslations,
	'mid-size': midSizeTranslations,
	'mid-size-business-payroll': midSizeTranslations,
	'payroll-solution-new': payrollSolutionNewTranslations,
	'enterprise-payroll': enterprisePayrollTranslations,
	'payroll-small-business': payrollSmallBusinessTranslations,
	blog: blogTranslations,
	'blog-author': blogAuthorTranslations,
	'blog-article': blogArticleTranslations,
} as unknown as Record<string, Record<string, AnyPageTranslations>>;

export function getPageTranslations(pageName: string, locale: string): AnyPageTranslations {
	const lang = locale.split('-')[0].toLowerCase();
	const pageTranslations = translations[pageName];

	if (!pageTranslations) {
		return translations.home.en;
	}

	return pageTranslations[lang] || pageTranslations.en;
}
