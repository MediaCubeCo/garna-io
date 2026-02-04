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

	const defaultLocale = `${country.defaultLanguage}-${countryCode}`;

	// Check if default locale is valid
	if (isValidLocale(defaultLocale)) {
		return defaultLocale;
	}

	// Try English for this country
	const enLocale = `en-${countryCode}`;
	if (isValidLocale(enLocale)) {
		return enLocale;
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

	// Check if default language is supported
	const supportedLanguages = getSupportedLanguageCodes();
	if (supportedLanguages.includes(country.defaultLanguage)) {
		return country.defaultLanguage;
	}

	// Fallback to English
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

		// Last resort: try with common countries for this language
		const commonCountries = {
			en: ['US', 'GB'],
			es: ['ES', 'MX'],
			pt: ['PT', 'BR'],
			ru: ['RU'],
		};

		for (const country of commonCountries[lang as keyof typeof commonCountries] || []) {
			const testLocale = `${lang}-${country}`;
			if (isValidLocale(testLocale)) {
				return testLocale;
			}
		}
	}

	// If language cannot be determined or is not supported, use IP-based fallback
	return getLangRegionFromIP(fallbackCountry);
}
