import { homeTranslations } from './translations/home';
import { offerTranslations } from './translations/offer';
import { notFoundTranslations } from './translations/404';

export type PageTranslations = typeof homeTranslations.en;

const translations: Record<string, Record<string, PageTranslations>> = {
	home: homeTranslations,
	offer: offerTranslations,
	'404': notFoundTranslations,
};

/**
 * Gets page translations based on page name and locale
 * @param pageName - page name (e.g., 'home', 'offer', '404')
 * @param locale - locale (e.g., 'en', 'es', 'pt', 'ru')
 * @returns object with translations or English translations as default
 */
export function getPageTranslations(pageName: string, locale: string): PageTranslations {
	// Extract language from locale (e.g., 'en-US' -> 'en')
	const lang = locale.split('-')[0].toLowerCase();

	const pageTranslations = translations[pageName];
	if (!pageTranslations) {
		console.warn(`[getPageTranslations] No translations found for page: ${pageName}`);
		return translations.home.en;
	}

	return pageTranslations[lang] || pageTranslations.en;
}
