import { describe, it, expect } from 'vitest';
import { resolveRoute } from '../src/utils/routes';
import { getLanguageFromIP, isValidLocale } from '../src/utils/locale';
import { getSupportedLanguageCodes } from '../src/config/languages';

describe('Route Resolution', () => {
	it('should resolve valid English route', () => {
		const result = resolveRoute('/en');
		expect(result.isValid).toBe(true);
		expect(result.locale).toBe('en');
		expect(result.language).toBe('en');
		expect(result.pathSegments).toEqual([]);
	});

	it('should resolve valid English route with path', () => {
		const result = resolveRoute('/en/offer');
		expect(result.isValid).toBe(true);
		expect(result.locale).toBe('en');
		expect(result.language).toBe('en');
		expect(result.pathSegments).toEqual(['offer']);
	});

	it('should resolve all supported languages', () => {
		const languages = getSupportedLanguageCodes();
		for (const lang of languages) {
			const result = resolveRoute(`/${lang}`);
			expect(result.isValid).toBe(true);
			expect(result.locale).toBe(lang);
			expect(result.language).toBe(lang);
		}
	});

	it('should handle double slashes', () => {
		const result = resolveRoute('/en//offer');
		expect(result.error).toBe('Path contains double slashes');
	});

	it('should handle trailing slashes', () => {
		const result = resolveRoute('/en/offer/');
		expect(result.error).toBe('Path contains trailing slash');
	});

	it('should handle invalid locale case', () => {
		const result = resolveRoute('/EN/offer');
		expect(result.error).toBe('Invalid locale case');
		expect(result.locale).toBe('en');
	});

	it('should handle empty path', () => {
		const result = resolveRoute('/');
		expect(result.error).toBe('Empty path');
	});

	it('should handle invalid locale format', () => {
		const result = resolveRoute('/invalid/offer');
		expect(result.error).toBe('Invalid locale format in path');
	});

	it('should preserve query and hash', () => {
		const result = resolveRoute('/en/offer?param=value#section');
		expect(result.query).toBe('param=value');
		expect(result.hash).toBe('section');
	});
});

describe('Locale Detection', () => {
	it('should detect English for US', () => {
		const language = getLanguageFromIP('US');
		expect(language).toBe('en');
	});

	it('should detect Spanish for Spain', () => {
		const language = getLanguageFromIP('ES');
		expect(language).toBe('es');
	});

	it('should detect Portuguese for Brazil', () => {
		const language = getLanguageFromIP('BR');
		expect(language).toBe('pt');
	});

	it('should detect Russian for Russia', () => {
		const language = getLanguageFromIP('RU');
		expect(language).toBe('ru');
	});

	it('should default to English for unknown countries', () => {
		const language = getLanguageFromIP('XX');
		expect(language).toBe('en');
	});

	it('should validate correct locales', () => {
		expect(isValidLocale('en-US')).toBe(true);
		expect(isValidLocale('es-ES')).toBe(true);
		expect(isValidLocale('pt-BR')).toBe(true);
		expect(isValidLocale('ru-RU')).toBe(true);
	});

	it('should reject invalid locales', () => {
		expect(isValidLocale('en-XX')).toBe(false);
		expect(isValidLocale('fr-FR')).toBe(false);
		expect(isValidLocale('invalid')).toBe(false);
	});
});

describe('Language Support', () => {
	it('should support exactly 4 languages', () => {
		const languages = getSupportedLanguageCodes();
		expect(languages).toHaveLength(4);
	});

	it('should include en, es, pt, ru', () => {
		const languages = getSupportedLanguageCodes();
		expect(languages).toContain('en');
		expect(languages).toContain('es');
		expect(languages).toContain('pt');
		expect(languages).toContain('ru');
	});
});
