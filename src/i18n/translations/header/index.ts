import { headerEn } from './en';
import { headerEs } from './es';
import { headerPt } from './pt';
import { headerRu } from './ru';

export type HeaderTranslations = typeof headerEn;

const headerTranslations: Record<string, HeaderTranslations> = {
	en: headerEn,
	es: headerEs,
	pt: headerPt,
	ru: headerRu,
};

/**
 * Returns header translations for the given language (fallback to en).
 */
export function getHeaderTranslations(lang: string): HeaderTranslations {
	const key = lang.split('-')[0].toLowerCase();
	return headerTranslations[key] ?? headerTranslations.en;
}
