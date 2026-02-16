import { getSupportedLanguageCodes } from '../config/languages';
import { countries } from '../config/countries';

/** @deprecated Locale is no longer detected by IP. Always returns 'en-US'. */
export function getLangRegionFromIP(_cfCountry: string): string {
	return 'en-US';
}

/** @deprecated Language is no longer detected by IP. Always returns 'en'. */
export function getLanguageFromIP(_cfCountry: string): string {
	return 'en';
}

export function isValidLocale(locale: string): boolean {
	const [lang, region] = locale.split('-');

	// Check if it's a supported language-region combination
	const supportedLanguages = getSupportedLanguageCodes();
	if (!supportedLanguages.includes(lang)) {
		return false;
	}

	const country = countries.find((c) => c.value === region);
	if (!country) {
		return false;
	}

	return country.defaultLanguage === lang || country.otherLanguages.includes(lang);
}

export function getLanguageFromInvalidLocale(locale: string, fallbackCountry: string): string {
	const [lang, region] = locale.split('-');

	// Check if the language from invalid locale is supported
	const supportedLanguages = getSupportedLanguageCodes();
	if (supportedLanguages.includes(lang)) {
		// Try to find a valid locale with this language
		const validLocale = `${lang}-${region}`;
		if (isValidLocale(validLocale)) {
			return validLocale;
		}

		// If not valid with original region, try with fallback country
		const fallbackLocale = `${lang}-${fallbackCountry.toUpperCase()}`;
		if (isValidLocale(fallbackLocale)) {
			return fallbackLocale;
		}

		// Last resort: try with common countries for this language (en/ru only)
		const commonCountries: Record<string, string[]> = {
			en: ['US', 'GB'],
			ru: ['RU'],
		};

		for (const country of commonCountries[lang] || []) {
			const testLocale = `${lang}-${country}`;
			if (isValidLocale(testLocale)) {
				return testLocale;
			}
		}
	}

	// If language cannot be determined or is not supported, use IP-based fallback
	return getLangRegionFromIP(fallbackCountry);
}
