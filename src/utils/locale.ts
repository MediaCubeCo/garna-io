import { countries } from '../config/countries';
import { getSupportedLanguageCodes } from '../config/languages';

export function getLangRegionFromIP(cfCountry: string): string {
	const countryCode = cfCountry.toUpperCase();

	// Handle special Cloudflare codes
	if (countryCode === 'XX' || countryCode === 'T1') {
		return 'en-US';
	}

	// Find country in configuration
	const country = countries.find((c) => c.value === countryCode);
	if (!country) {
		return 'en-US';
	}

	// Only en and ru are supported: Russian countries get ru-RU, others get en-US
	if (country.defaultLanguage === 'ru') {
		return 'ru-RU';
	}
	return 'en-US';
}

export function getLanguageFromIP(cfCountry: string): string {
	const countryCode = cfCountry.toUpperCase();

	// Handle special Cloudflare codes
	if (countryCode === 'XX' || countryCode === 'T1') {
		return 'en';
	}

	// Find country in configuration
	const country = countries.find((c) => c.value === countryCode);
	if (!country) {
		return 'en';
	}

	// Only Russian (by country default) gets Russian; all others get English
	if (country.defaultLanguage === 'ru') {
		return 'ru';
	}
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
