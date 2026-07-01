import { homeTranslations } from './translations/home';
import { offerTranslations } from './translations/offer';
import { notFoundTranslations } from './translations/404';
import { formTranslations } from './translations/form';
import { aiHiringTranslations } from './translations/ai-hiring';
import { whiteLabelTranslations } from './translations/white-label';
import { eorTranslations } from './translations/eor';
import { payrollSmallBusinessTranslations } from './translations/payroll-small-business';
import { blogArticleTranslations, blogAuthorTranslations, blogTranslations } from './translations/blog';

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
