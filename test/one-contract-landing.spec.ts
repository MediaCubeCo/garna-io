import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { oneContractTranslations } from '../src/i18n/translations/one-contract';

const root = path.resolve(import.meta.dirname, '..');
const read = (relativePath: string) => readFile(path.join(root, relativePath), 'utf8');

describe('one contract advertising landing', () => {
	it('publishes a searchable route for all four locales', async () => {
		const [pages, routes, page] = await Promise.all([
			read('src/config/pages.ts'),
			read('src/routes/dynamic.ts'),
			read('astro/pages/one-contract.astro'),
		]);

		expect(pages).toMatch(/path: 'one-contract',[\s\S]*?searchable: true,[\s\S]*?languages: \['en', 'es', 'pt', 'ru'\]/);
		expect(routes).toContain("'one-contract': '/one-contract.html'");
		expect(routes).toContain("'one-contract': 'one-contract'");
		expect(page).toContain("import BaseLayout from '../layouts/BaseLayout.astro'");
		expect(page).not.toContain('noindex, nofollow, noarchive');
	});

	it('keeps the ad promise, eight content blocks and one demo action', async () => {
		const page = await read('astro/pages/one-contract.astro');

		expect(page).toContain('One contract with Garna');
		expect(page).toContain('instead of hundreds');
		expect(page).toContain('id="how-it-works"');
		expect(page).toContain('id="documents"');
		expect(page).toContain('id="faq"');
		expect(page).toContain('id="demo"');
		expect(page).toContain('embedInline={true}');
		expect(page).toContain("trackingPage=\"one-contract\"");
	});

	it('tracks the landing-specific funnel without an obstructive sticky CTA', async () => {
		const [page, styles] = await Promise.all([
			read('astro/pages/one-contract.astro'),
			read('astro/styles/one-contract.css'),
		]);

		expect(page).toContain("track('cta_click'");
		expect(page).toContain("track('form_start'");
		expect(page).toContain("percent_scrolled: threshold");
		expect(page).not.toContain('mobile_sticky');
		expect(styles).not.toContain('.one-contract-mobile-cta');
	});

	it('ships dedicated Spanish, Portuguese, and Russian copy', () => {
		expect(oneContractTranslations.es.hero.title).toContain('Un contrato con Garna');
		expect(oneContractTranslations.pt.hero.title).toContain('Um contrato com a Garna');
		expect(oneContractTranslations.ru.hero.title).toContain('Один договор с Garna');
		expect(oneContractTranslations.es).not.toBe(oneContractTranslations.en);
		expect(oneContractTranslations.pt).not.toBe(oneContractTranslations.en);
		expect(oneContractTranslations.ru).not.toBe(oneContractTranslations.en);
	});

	it('keeps every page-specific translation key in all four locales', () => {
		const sections = ['meta', 'hero', 'comparison', 'process', 'documents', 'risk', 'audience', 'faq', 'demo', 'finalCta'] as const;
		const leafPaths = (value: unknown, prefix = ''): string[] => {
			if (Array.isArray(value)) return value.flatMap((item, index) => leafPaths(item, `${prefix}.${index}`));
			if (value && typeof value === 'object') {
				return Object.entries(value).flatMap(([key, item]) => leafPaths(item, prefix ? `${prefix}.${key}` : key));
			}
			return [prefix];
		};
		const englishKeys = sections.flatMap((section) => leafPaths(oneContractTranslations.en[section], section)).sort();

		for (const locale of ['es', 'pt', 'ru'] as const) {
			const localeKeys = sections.flatMap((section) => leafPaths(oneContractTranslations[locale][section], section)).sort();
			expect(localeKeys).toEqual(englishKeys);
		}
	});
});
