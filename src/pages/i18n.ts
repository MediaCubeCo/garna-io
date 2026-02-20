import { homeTranslations } from './translations/home';
import { offerTranslations } from './translations/offer';
import { notFoundTranslations } from './translations/404';
import { formTranslations } from './translations/form';

/** Home page translation shape (full structure). */
export type PageTranslations = typeof homeTranslations.en;

/** Union of all page translation shapes — each page has its own structure. */
type AnyPageTranslations =
	| typeof homeTranslations.en
	| typeof offerTranslations.en
	| typeof notFoundTranslations.en
	| typeof formTranslations.en;

const translations: Record<string, Record<string, AnyPageTranslations>> = {
	home: homeTranslations,
	offer: offerTranslations,
	'404': notFoundTranslations,
	form: formTranslations,
};

/**
 * Gets page translations based on page name and locale
 * @param pageName - page name (e.g., 'home', 'offer', '404')
 * @param locale - locale (e.g., 'en', 'es', 'pt', 'ru')
 * @returns object with translations or English translations as default
 */
export function getPageTranslations(pageName: string, locale: string): AnyPageTranslations {
	// Extract language from locale (e.g., 'en-US' -> 'en')
	const lang = locale.split('-')[0].toLowerCase();

	const pageTranslations = translations[pageName];
	if (!pageTranslations) {
		return translations.home.en;
	}

	return pageTranslations[lang] || pageTranslations.en;
}
