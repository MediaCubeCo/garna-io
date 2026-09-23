import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..');

const read = (relativePath: string) => readFile(path.join(root, relativePath), 'utf8');

describe('isolated advertising landing', () => {
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
	});

	it('keeps header navigation inside the landing page', async () => {
		const header = await read('astro/components/layout/AdsLandingHeader.astro');
		const hrefs = [...header.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

		expect(hrefs.length).toBeGreaterThan(0);
		expect(hrefs.every((href) => href === '#' || href.startsWith('#'))).toBe(true);
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

	it('places five Garna chat cards in the Problems We Solve section after the hero', async () => {
		const [page, problems] = await Promise.all([
			read('astro/pages/ads-landing.astro'),
			read('astro/ads-landing/ProblemsWeSolveSection.astro'),
		]);

		expect(page).toContain('<ProblemsWeSolveSection />');
		expect(page.indexOf('<ProblemsWeSolveSection />')).toBeGreaterThan(page.indexOf('<EorHeroSection />'));
		expect(page.indexOf('<ProblemsWeSolveSection />')).toBeLessThan(page.indexOf('<WhoGlobalInvoicingIsForSection />'));
		expect(problems).toContain('Problems We Solve');
		expect(problems.match(/problemKey:/g)).toHaveLength(5);
		expect(problems.match(/solutionKey:/g)).toHaveLength(5);
		expect(problems).toContain('grid-template-columns: repeat(6, minmax(0, 1fr))');
		expect(problems.match(/avatar:/g)).toHaveLength(5);
		expect(problems).toContain('/images/garna-g-mark-dark.svg');
		expect(problems).not.toContain('problem-avatar--lime');
		expect(problems).toContain("import Card from '../components/ui/Card.astro'");
		expect(problems).toContain('problem-chat-card--bottom-left');
		expect(problems).toContain('problem-chat-card--bottom-right');
		expect(problems).not.toContain('var(--garna-surface-raised)');
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

	it('presents four additional global invoicing benefits after the payment flows', async () => {
		const [page, benefits, translations] = await Promise.all([
			read('astro/pages/ads-landing.astro'),
			read('astro/ads-landing/WhatElseYouGetSection.astro'),
			read('src/i18n/translations/ads-landing/en.ts'),
		]);

		expect(page).toContain('<WhatElseYouGetSection />');
		expect(page.indexOf('<WhatElseYouGetSection />')).toBeGreaterThan(page.indexOf('<TwoWaysToGetPaidSection />'));
		expect(benefits).toContain('What Else You Get');
		expect(benefits.match(/<Card /g)).toHaveLength(4);
		expect(benefits).toContain('Flexible Withdrawals');
		expect(benefits).toContain('Tax-Ready Records');
		expect(benefits).toContain('Visa-Ready Income Proof');
		expect(benefits).toContain('Payment Tracking');
		expect(translations).toContain('"whatElseYouGet"');
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
		expect(comparison).not.toContain('comparison-table__cta-row');
		expect(comparison).toContain('comparison-table__footer-primary');
		expect(comparison).toContain('data-garna-signup');
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
