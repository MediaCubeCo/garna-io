import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { adsLandingTranslations } from '../src/i18n/translations/ads-landing';

const root = path.resolve(import.meta.dirname, '..');

const read = (relativePath: string) => readFile(path.join(root, relativePath), 'utf8');

const translationKeys = (value: unknown, prefix = ''): string[] => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix];
	return Object.entries(value).flatMap(([key, nestedValue]) =>
		translationKeys(nestedValue, prefix ? `${prefix}.${key}` : key));
};

describe('isolated advertising landing', () => {
	it('keeps complete Russian, Spanish, and Portuguese translation keys', () => {
		const englishKeys = translationKeys(adsLandingTranslations.en).sort();

		for (const locale of ['ru', 'es', 'pt'] as const) {
			expect(translationKeys(adsLandingTranslations[locale]).sort()).toEqual(englishKeys);
		}
	});

	it('keeps Russian copy free of ё and preserves sample names and professions in English', () => {
		const russianCopy = JSON.stringify(adsLandingTranslations.ru);

		expect(russianCopy).not.toMatch(/[Ёё]/);
		expect(adsLandingTranslations.ru.globalInvoicingHowTo.panel.signup.firstNameValue).toBe('Maya');
		expect(adsLandingTranslations.ru.globalInvoicingHowTo.panel.signup.lastNameValue).toBe('Lewis');
		expect(adsLandingTranslations.ru.visual.why.productDesigner).toBe('Product designer');
		expect(adsLandingTranslations.ru.visual.why.backendEngineer).toBe('Backend engineer');
		expect(adsLandingTranslations.ru.visual.why.growthLead).toBe('Growth lead');
	});

	it('resolves every literal translation key used by the global invoicing workflow', async () => {
		const source = await read('astro/ads-landing/GlobalInvoicingStepsSection.astro');
		const referencedKeys = [
			...source.matchAll(/data-translate(?:-aria-label|-alt|-placeholder)?="([^"]+)"/g),
		].map((match) => match[1]);
		const availableKeys = new Set(translationKeys(adsLandingTranslations.en));

		expect(referencedKeys.length).toBeGreaterThan(0);
		expect(referencedKeys.filter((key) => !availableKeys.has(key))).toEqual([]);
	});

	it('has its own route, asset and translation family', async () => {
		const [pages, dynamicRoute, i18n] = await Promise.all([
			read('src/config/pages.ts'),
			read('src/routes/dynamic.ts'),
			read('src/i18n/index.ts'),
		]);

		expect(pages).toContain("path: 'ads-landing'");
		expect(pages).toMatch(/path: 'ads-landing',[\s\S]*?searchable: false/);
		expect(dynamicRoute).toContain("'ads-landing': '/ads-landing.html'");
		expect(dynamicRoute).toContain("'ads-landing': 'ads-landing'");
		expect(i18n).toContain("'ads-landing': adsLandingTranslations");
	});

	it('does not import EOR page components or shared EOR content configuration', async () => {
		const page = await read('astro/pages/ads-landing.astro');

		expect(page).toContain("from '../ads-landing/");
		expect(page).toContain("from '../layouts/AdsLandingLayout.astro'");
		expect(page).not.toContain('components/sections/payroll');
		expect(page).not.toContain('pageShells.eor');
		expect(page).not.toContain('pageFinalCtas.eor');
		expect(page).toContain("effect: 'rotating-flare' as const");
	});

	it('keeps header navigation inside the landing page', async () => {
		const header = await read('astro/components/layout/AdsLandingHeader.astro');
		const hrefs = [...header.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
		const navigationTargets = [
			'#who-global-invoicing-is-for',
			'#how-global-invoicing-works',
			'#payout-calculator',
			'#global-invoicing-faq',
		];

		expect(hrefs.length).toBeGreaterThan(0);
		expect(hrefs.every((href) => href === '#' || href.startsWith('#'))).toBe(true);
		expect(navigationTargets.every((target) => hrefs.includes(target))).toBe(true);
		expect(header).not.toContain('data-landing-nav-link');
		expect(header).not.toContain('aria-current');
		expect(header).not.toContain('IntersectionObserver');
		expect(header).not.toContain('#eor-');
		expect(header).not.toContain('#landing-');
		expect(header).not.toContain('window.location.hash');
		expect(header).not.toContain('data-localized-path');
		expect(header).not.toContain('data-garna-home');
	});

	it('uses a Global Invoicing hero with an account-creation CTA', async () => {
		const [hero, translations] = await Promise.all([
			read('astro/ads-landing/EorHeroSection.astro'),
			read('src/i18n/translations/ads-landing/en.ts'),
		]);

		expect(hero).toContain('Invoice Clients Globally');
		expect(hero).toContain('data-garna-signup');
		expect(hero).toContain('hero.cards.monthlyIncome');
		expect(hero).toContain('hero.cards.balance');
		expect(hero).not.toContain('eor_hero_book_demo');
		expect(translations).toContain('Global Invoicing for Independent Professionals');
	});

	it('presents five named Garna chat problems in a sticky visual carousel after the hero', async () => {
		const [page, problems] = await Promise.all([
			read('astro/pages/ads-landing.astro'),
			read('astro/ads-landing/ProblemsWeSolveSection.astro'),
		]);

		expect(page).toContain('<ProblemsWeSolveSection />');
		expect(page.indexOf('<ProblemsWeSolveSection />')).toBeGreaterThan(page.indexOf('<EorHeroSection />'));
		expect(page.indexOf('<ProblemsWeSolveSection />')).toBeLessThan(page.indexOf('<WhoGlobalInvoicingIsForSection />'));
		expect(problems).toContain('Problems We Solve');
		expect(problems).toContain('problems.description');
		expect(problems).toContain('problems.button');
		expect(problems.match(/problemKey:/g)).toHaveLength(5);
		expect(problems.match(/solutionKey:/g)).toHaveLength(5);
		expect(problems.match(/titleKey:/g)).toHaveLength(5);
		expect(problems).toContain('data-problems-carousel');
		expect(problems).toContain('data-problem-slide');
		expect(problems).toContain('data-problem-dot');
		expect(problems).toContain('position: sticky');
		expect(problems).toContain('min-height: 300vh');
		expect(problems).toContain('grid-template-columns: minmax(17rem, .82fr) minmax(0, 1.18fr)');
		expect(problems.match(/avatar:/g)).toHaveLength(5);
		expect(problems).toContain('/images/garna-g-mark-dark.svg');
		expect(problems).toContain("import Button from '../components/ui/Button.astro'");
		expect(problems).toContain('data-garna-signup');
	});

	it('introduces the invoicing audience with the home-page feature-card pattern', async () => {
		const [page, audience] = await Promise.all([
			read('astro/pages/ads-landing.astro'),
			read('astro/ads-landing/WhoGlobalInvoicingIsForSection.astro'),
		]);

		expect(page).toContain('<WhoGlobalInvoicingIsForSection />');
		expect(page.indexOf('<WhoGlobalInvoicingIsForSection />')).toBeGreaterThan(page.indexOf('<EorHeroSection />'));
		expect(page.indexOf('<WhoGlobalInvoicingIsForSection />')).toBeGreaterThan(page.indexOf('<ProblemsWeSolveSection />'));
		expect(audience).toContain('Who Global Invoicing Is For');
		expect(audience).toContain("import Section from '../components/layout/Section.astro'");
		expect(audience).toContain("import Card from '../components/ui/Card.astro'");
		expect(audience.match(/titleKey:/g)).toHaveLength(4);
	});

	it('presents a professional client experience with the Contractor of Record split layout', async () => {
		const [page, professional] = await Promise.all([
			read('astro/pages/ads-landing.astro'),
			read('astro/ads-landing/LookProfessionalSection.astro'),
		]);

		expect(page).toContain('<LookProfessionalSection />');
		expect(page.indexOf('<LookProfessionalSection />')).toBeGreaterThan(page.indexOf('<WhoGlobalInvoicingIsForSection />'));
		expect(page).not.toContain('<EorCountriesSection />');
		expect(professional).toContain('Look Professional to Clients');
		expect(professional).toContain('contractor-cost-human-upscaled.jpg');
		expect(professional).toContain('grid-template-columns: minmax(0, 0.88fr) minmax(18rem, 1.12fr)');
		expect(professional).toContain('professional.visual.status');
		expect(professional).toContain('data-garna-signup');
	});

	it('keeps an isolated four-step Global Invoicing workflow after the professional client section', async () => {
		const [page, steps] = await Promise.all([
			read('astro/pages/ads-landing.astro'),
			read('astro/ads-landing/GlobalInvoicingStepsSection.astro'),
		]);

		expect(page).toContain('<GlobalInvoicingStepsSection />');
		expect(page.indexOf('<GlobalInvoicingStepsSection />')).toBeGreaterThan(page.indexOf('<LookProfessionalSection />'));
		expect(page.indexOf('<GlobalInvoicingStepsSection />')).toBeLessThan(page.indexOf('<PlatformIntroSection />'));
		expect(steps).toContain('How Global Invoicing Works');
		expect(steps.match(/data-process-step=/g)).toHaveLength(4);
		expect(steps).toContain("import Section from '../components/layout/Section.astro'");
	});

	it('offers two Garna payment flows after the global invoicing steps', async () => {
		const [page, paymentWays] = await Promise.all([
			read('astro/pages/ads-landing.astro'),
			read('astro/ads-landing/TwoWaysToGetPaidSection.astro'),
		]);

		expect(page).toContain('<TwoWaysToGetPaidSection />');
		expect(page.indexOf('<TwoWaysToGetPaidSection />')).toBeGreaterThan(page.indexOf('<GlobalInvoicingStepsSection />'));
		expect(paymentWays).toContain('Two Ways to Get Paid');
		expect(paymentWays).toContain("import TabbedImageFeatureSection from '../components/sections/TabbedImageFeatureSection.astro'");
		expect(paymentWays.match(/key: '(invoice|transfer)'/g)).toHaveLength(2);
		expect(paymentWays).toContain('twoWays.panels.invoice.description');
		expect(paymentWays).toContain('twoWays.panels.transfer.description');
	});

	it('presents three stacked global invoicing benefits after the payment flows', async () => {
		const [page, benefits, translations] = await Promise.all([
			read('astro/pages/ads-landing.astro'),
			read('astro/ads-landing/WhatElseYouGetSection.astro'),
			read('src/i18n/translations/ads-landing/en.ts'),
		]);

		expect(page).toContain('<WhatElseYouGetSection />');
		expect(page.indexOf('<WhatElseYouGetSection />')).toBeGreaterThan(page.indexOf('<TwoWaysToGetPaidSection />'));
		expect(benefits).toContain('What Else You Get');
		expect(benefits).toContain("from '../components/sections/StackedCardsSection.astro'");
		expect(benefits.match(/key: '/g)).toHaveLength(3);
		expect(benefits).toContain('Flexible Withdrawals');
		expect(benefits).toContain('Tax Guidance');
		expect(benefits).toContain('Digital Nomad Visa');
		expect(benefits).not.toContain('Payment Tracking');
		expect(translations).toContain('"whatElseYouGet"');
	});

	it('uses a working global invoicing payout calculator instead of an EOR hiring estimator', async () => {
		const [calculator, translations] = await Promise.all([
			read('astro/ads-landing/EorCostEstimatorSection.astro'),
			read('src/i18n/translations/ads-landing/en.ts'),
		]);

		expect(calculator).toContain('Always Know What You’ll Get');
		expect(calculator).toContain('Payout Calculator');
		expect(calculator).toContain('data-payout-calculator');
		expect(calculator).toContain("method === 'card' ? 0.08 : 0.05");
		expect(calculator).toContain("feePayer === 'freelancer'");
		expect(calculator).toContain('data-garna-signup');
		expect(calculator).toContain("import SectionHeader from '../components/layout/SectionHeader.astro'");
		expect(calculator).toContain('eor-cost-estimator-business-desk-v9.png');
		expect(calculator).toContain('max-width: 36rem');
		expect(calculator).toContain('gap: 1.2rem');
		expect(calculator).toContain('padding: clamp(1.15rem, 2vw, 1.55rem)');
		expect(calculator).toContain('icon="none"');
		expect(calculator).toContain('eor-estimator-segments--currency');
		expect(calculator.match(/role="radiogroup"/g)).toHaveLength(3);
		expect(calculator).toContain(':has(label:nth-child(2) input:checked)::before');
		expect(calculator).toContain('background: #cbf300');
		expect(calculator).toContain('inset: 0 auto 0 0');
		expect(calculator).toContain('min-height: 2.75rem');
		expect(calculator).toContain('min-height: calc(2.75rem + 2px)');
		expect(calculator).toContain('grid-template-columns: minmax(0, 1.05fr) minmax(27rem, 0.95fr)');
		expect(calculator).toContain('background: rgb(0 0 0 / 0.55)');
		expect(calculator).toContain('margin-top: calc((var(--detail-line-height) - 1.25rem) / 2)');
		expect(calculator.match(/costEstimator\.details\./g)).toHaveLength(4);
		expect(calculator).toContain('Garna charges 5%');
		expect(calculator).not.toContain('Global Hiring Cost Estimator');
		expect(calculator).not.toContain('payout-section__facts');
		expect(translations).toContain('"title": "Always Know What You’ll Get"');
	});

	it('compares Garna with alternative payment setups after the calculator', async () => {
		const [page, comparison] = await Promise.all([
			read('astro/pages/ads-landing.astro'),
			read('astro/ads-landing/WhyGarnaComparisonSection.astro'),
		]);

		expect(page).toContain('<WhyGarnaComparisonSection />');
		expect(page.indexOf('<WhyGarnaComparisonSection />')).toBeGreaterThan(page.indexOf('<EorCostEstimatorSection />'));
		expect(page.indexOf('<WhyGarnaComparisonSection />')).toBeLessThan(page.indexOf('<FAQSection'));
		expect(comparison).toContain('Why Garna');
		expect(comparison.match(/values: \[/g)).toHaveLength(7);
		expect(comparison).toContain('position: sticky');
		expect(comparison).toContain('top: 64px');
		expect(comparison).toContain('overflow: clip');
		expect(comparison).not.toContain('overflow: hidden;');
		expect(comparison).toContain('comparison-table__primary-header-surface');
		expect(comparison).toContain('background: #101010 !important');
		expect(comparison).not.toContain('comparison-table__cta-row');
		expect(comparison).toContain('comparison-table__footer-primary');
		expect(comparison).toContain('data-garna-signup');
	});

	it('answers nine global invoicing questions instead of reusing the EOR FAQ', async () => {
		const [page, translations] = await Promise.all([
			read('astro/pages/ads-landing.astro'),
			read('src/i18n/translations/ads-landing/en.ts'),
		]);

		expect(page).toContain('Global Invoicing FAQ');
		expect(page).toContain('How do I get paid by a foreign client?');
		expect(page).toContain('What documents will I get?');
		expect(page.match(/questionTranslateKey: 'faq\.items\.q\d\.question'/g)).toHaveLength(9);
		expect(page).not.toContain('What is an Employer of Record (EOR)?');
		expect(translations).toContain('"q9"');
	});

	it('keeps the approved landing-page section sequence', async () => {
		const page = await read('astro/pages/ads-landing.astro');
		const sections = [
			'<EorHeroSection />',
			'<ProblemsWeSolveSection />',
			'<WhoGlobalInvoicingIsForSection />',
			'<LookProfessionalSection />',
			'<GlobalInvoicingStepsSection />',
			'<TwoWaysToGetPaidSection />',
			'<WhatElseYouGetSection />',
			'<PlatformIntroSection />',
			'<EorCostEstimatorSection />',
			'<WhyGarnaComparisonSection />',
			'<FAQSection',
			'<FinalCTASection',
		];
		const positions = sections.map((section) => page.indexOf(section));

		expect(positions.every((position) => position >= 0)).toBe(true);
		expect(positions).toEqual([...positions].sort((a, b) => a - b));
	});

	it('ends with a global invoicing account-creation CTA', async () => {
		const page = await read('astro/pages/ads-landing.astro');

		expect(page).toContain('Get Your First Payment With Global Invoicing');
		expect(page).toContain("label: 'Create account'");
		expect(page).toContain("kind: 'signup' as const");
		expect(page).not.toContain('Hire Employees Globally Without Opening Local Entities');
	});

	it('follows the hero with a focused invoicing platform introduction', async () => {
		const [page, intro] = await Promise.all([
			read('astro/pages/ads-landing.astro'),
			read('astro/ads-landing/PlatformIntroSection.astro'),
		]);

		expect(page).toContain('<PlatformIntroSection />');
		expect(page).not.toContain('<EorWhyGarnaSection />');
		expect(page).not.toContain('Hire Abroad Without Guesswork');
		expect(page.indexOf('<PlatformIntroSection />')).toBeGreaterThan(page.indexOf('<WhatElseYouGetSection />'));
		expect(page.indexOf('<PlatformIntroSection />')).toBeLessThan(page.indexOf('<EorCostEstimatorSection />'));
		expect(page).not.toContain('<EorDashboardCtaSection />');
		expect(intro).toContain('One Platform Instead of a Dozen Workarounds');
		expect(intro).toContain("import Section from '../components/layout/Section.astro'");
		expect(intro).toContain("import ContractorDashboardVisual from './ContractorDashboardVisual.astro'");
		expect(intro).toContain('<ContractorDashboardVisual />');
		expect(intro).not.toContain('Available to withdraw');
		expect(intro).not.toContain('Watch Video');
	});
});
