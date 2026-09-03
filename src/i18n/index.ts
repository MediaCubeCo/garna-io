import { offerTranslations } from './translations/offer';
import { contractorOfRecordTranslations as contractorOfRecordPageTranslations } from './translations/contractor-of-record';
import { notFoundTranslations } from './translations/404';
import { formTranslations } from './translations/form';
import { aiHiringTranslations } from './translations/ai-hiring';
import { whiteLabelTranslations } from './translations/white-label';
import { eorTranslations } from './translations/eor';
import { payrollSmallBusinessTranslations } from './translations/payroll-small-business';
import { midSizeTranslations } from './translations/mid-size';
import { payrollSolutionNewTranslations as homeTranslations } from './translations/payroll-solution-new';
import { forCreatorsTranslations } from './translations/for-creators';
import { blogArticleTranslations, blogAuthorTranslations, blogTranslations } from './translations/blog';
import { enterprisePayrollTranslations } from './translations/enterprise-payroll';
import { taxCalculatorTranslations } from './translations/tax-calculator';
import { eorCostCalculatorTranslations } from './translations/eor-cost-calculator';
import { gamescom2026Translations } from './translations/gamescom-2026-side-events';

export type PageTranslations = typeof homeTranslations.en;

type AnyPageTranslations =
	| typeof homeTranslations.en
	| typeof contractorOfRecordPageTranslations.en
	| typeof offerTranslations.en
	| typeof notFoundTranslations.en
	| typeof formTranslations.en
	| typeof aiHiringTranslations.en
	| typeof whiteLabelTranslations.en
	| typeof eorTranslations.en
	| typeof payrollSmallBusinessTranslations.en
	| typeof midSizeTranslations.en
	| typeof homeTranslations.en
	| typeof forCreatorsTranslations.en
	| typeof enterprisePayrollTranslations.en
	| typeof blogTranslations.en
	| typeof blogAuthorTranslations.en
	| typeof blogArticleTranslations.en
	| typeof taxCalculatorTranslations.en
	| typeof eorCostCalculatorTranslations.en
	| typeof gamescom2026Translations.en;

const translations = {
	home: homeTranslations,
	'contractor-of-record': contractorOfRecordPageTranslations,
	offer: offerTranslations,
	'404': notFoundTranslations,
	form: formTranslations,
	'ai-hiring': aiHiringTranslations,
	'white-label': whiteLabelTranslations,
	eor: eorTranslations,
	'employer-of-record': eorTranslations,
	'for-creators': forCreatorsTranslations,
	'mid-size': midSizeTranslations,
	'mid-size-business-payroll': midSizeTranslations,
	'enterprise-payroll': enterprisePayrollTranslations,
	'payroll-small-business': payrollSmallBusinessTranslations,
	blog: blogTranslations,
	'blog-author': blogAuthorTranslations,
	'blog-article': blogArticleTranslations,
	'tax-calculator': taxCalculatorTranslations,
	'eor-cost-calculator': eorCostCalculatorTranslations,
	'gamescom-2026-side-events': gamescom2026Translations,
} as unknown as Record<string, Record<string, AnyPageTranslations>>;

export function getPageTranslations(pageName: string, locale: string): AnyPageTranslations {
	const lang = locale.split('-')[0].toLowerCase();
	const pageTranslations = translations[pageName];

	if (!pageTranslations) {
		return translations.home.en;
	}

	return pageTranslations[lang] || pageTranslations.en;
}
