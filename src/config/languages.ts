export const languages = [
	{
		label: 'English',
		value: 'en',
	},
	{
		label: 'Русский',
		value: 'ru',
	},
];

/**
 * Returns array of supported language codes
 * @returns Array of language codes: ['en', 'ru']
 */
export function getSupportedLanguageCodes(): string[] {
	return languages.map((l) => l.value);
}

/**
 * Returns Set of supported language codes for fast lookup
 * @returns Set containing language codes
 */
export function getSupportedLanguageCodesSet(): Set<string> {
	return new Set(getSupportedLanguageCodes());
}

/**
 * Checks if a language code is supported
 * @param code Language code to check (e.g., 'en', 'ru')
 * @returns true if language is supported, false otherwise
 */
export function isSupportedLanguage(code: string): boolean {
	return getSupportedLanguageCodesSet().has(code);
}
