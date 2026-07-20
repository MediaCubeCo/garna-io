import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getArchitectureViolations } from '../scripts/check-astro-architecture.mjs';

const root = path.resolve(import.meta.dirname, '..');
const locales = ['en', 'es', 'pt', 'ru'];

async function walk(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const absolute = path.join(directory, entry.name);
			return entry.isDirectory() ? walk(absolute) : [absolute];
		}),
	);
	return files.flat();
}

describe('native Astro architecture', () => {
	it('keeps all 18 public and Worker-template entrypoints', async () => {
		const pages = (await walk(path.join(root, 'astro/pages'))).filter((file) => file.endsWith('.astro'));
		expect(pages).toHaveLength(18);
		expect(pages.some((file) => file.includes(`${path.sep}pages${path.sep}en${path.sep}`))).toBe(false);
		expect(pages.some((file) => file.endsWith(`${path.sep}payroll-solution-new.astro`))).toBe(false);
		expect(pages.some((file) => file.endsWith(`${path.sep}mid-size.astro`))).toBe(false);
	});

	it('keeps components organized by architectural responsibility', async () => {
		const componentsRoot = path.join(root, 'astro/components');
		const rootEntries = await readdir(componentsRoot, { withFileTypes: true });
		const rootAstroComponents = rootEntries.filter(
			(entry) => entry.isFile() && entry.name.endsWith('.astro'),
		);
		const sectionComponents = (await walk(componentsRoot)).filter(
			(file) => file.endsWith(`${path.sep}Section.astro`),
		);
		const hero = await readFile(
			path.join(componentsRoot, 'sections/HeroSection.astro'),
			'utf8',
		);

		expect(rootAstroComponents).toEqual([]);
		expect(sectionComponents).toEqual([
			path.join(componentsRoot, 'layout/Section.astro'),
		]);
		expect(hero).toContain('<section class={className} data-section-kind="hero">');
		expect(hero).not.toContain("import Section from");
	});

	it('does not reintroduce legacy runtime composition', async () => {
		expect(await getArchitectureViolations()).toEqual([]);
		const blogAdmin = await readFile(path.join(root, 'src/blog/admin.ts'), 'utf8');
		expect(blogAdmin).not.toContain('/admin/blog/design-preview');
		expect(blogAdmin).not.toContain('Legacy designs');
	});

	it('keeps EN, ES, PT and RU modules complete for every localized page family', async () => {
		const translationsRoot = path.join(root, 'src/i18n/translations');
		const entries = await readdir(translationsRoot, { withFileTypes: true });
		const families = entries.filter((entry) => entry.isDirectory() && entry.name !== 'blog');

		for (const family of families) {
			const files = await readdir(path.join(translationsRoot, family.name));
			for (const locale of locales) expect(files).toContain(`${locale}.ts`);
		}
	});

	it('keeps homepage sections outside the embedded API code visual', async () => {
		const source = await readFile(
			path.join(root, 'astro/components/sections/payroll/home/EmbeddedPayrollInfrastructureSection.astro'),
			'utf8',
		);

		expect(source).toContain('<span class="text-[#61afef]">create</span>(&#123;');
		expect(source).toContain('<div class="whitespace-nowrap">&#125;);</div>');
		expect(source).not.toContain('<span class="text-[#61afef]">create</span>({');
	});

	it('composes the homepage from explicit reusable sections in visual order', async () => {
		const source = await readFile(path.join(root, 'astro/pages/index.astro'), 'utf8');
		const sectionTags = [
			'<HeroSection',
			'<PayrollStatsSection',
			'<ManageGlobalPayrollSection',
			'<HireEmployeesWorldwideSection',
			'<ContractorPaymentsSection',
			'<EffectivePayrollSection',
			'<DeferredContractorPaymentsSection',
			'<EmbeddedPayrollInfrastructureSection',
			'<StartPayingGloballySection',
			'<WhyCompaniesChooseGarnaSection',
			'<PayrollComparisonSection',
			'<TrustedByBuildersSection',
			'<FAQSection',
			'<FinalCTASection',
		];
		const positions = sectionTags.map((tag) => source.indexOf(tag));

		expect(positions.every((position) => position >= 0)).toBe(true);
		expect(positions).toEqual([...positions].sort((left, right) => left - right));
		expect(source).not.toContain('PayrollSolutionSections');
	});

	it('builds homepage content with the shared section composition contract', async () => {
		const homeSectionsRoot = path.join(root, 'astro/components/sections/payroll/home');
		const homeSections = (await readdir(homeSectionsRoot)).filter((file) => file.endsWith('.astro'));
		const sectionSources = await Promise.all(
			homeSections.map((file) => readFile(path.join(homeSectionsRoot, file), 'utf8')),
		);
		const sectionComponent = await readFile(path.join(root, 'astro/components/layout/Section.astro'), 'utf8');
		const interactions = await readFile(
			path.join(root, 'astro/components/sections/payroll/PayrollSolutionInteractions.astro'),
			'utf8',
		);

		expect(sectionSources).toHaveLength(11);
		expect(sectionSources.every((source) => source.includes("layout/Section.astro"))).toBe(true);
		expect(sectionSources.filter((source) => source.includes('SegmentedControl'))).toHaveLength(2);
		expect(sectionSources.some((source) => source.includes('layout="split"'))).toBe(true);
		expect(sectionSources.some((source) => source.includes('action={{'))).toBe(true);
		expect(sectionComponent).toContain('<slot name="controls" />');
		expect(sectionComponent).toContain('<slot name="copy" />');
		expect(sectionComponent).toContain('<slot name="action" />');
		expect(interactions).not.toContain('function switchFlow');
	});

	it('composes every non-blog entrypoint without page-sized section aggregators', async () => {
		const nonBlogPages = [
			'404.astro',
			'ai-hiring.astro',
			'contractor-of-record.astro',
			'employer-of-record.astro',
			'enterprise-payroll.astro',
			'for-contractors.astro',
			'form.astro',
			'index.astro',
			'mid-size-business-payroll.astro',
			'payroll-small-business.astro',
			'tax-calculator.astro',
			'white-label.astro',
		];
		const pageSources = await Promise.all(
			nonBlogPages.map((file) => readFile(path.join(root, 'astro/pages', file), 'utf8')),
		);
		const removedAggregators = [
			'AIHiringSections',
			'ContractorSections',
			'ContractorOfRecordSections',
			'EmployerOfRecordSections',
			'EnterprisePayrollSections',
			'MidSizeSections',
			'SmallBusinessSections',
			'WhiteLabelSections',
			'PayrollLandingLayout',
		];

		expect(pageSources.every((source) => !source.includes('<section'))).toBe(true);
		for (const aggregator of removedAggregators) {
			expect(pageSources.every((source) => !source.includes(aggregator))).toBe(true);
		}
	});

	it('wraps every migrated non-blog content section with the shared Section component', async () => {
		const sectionsRoot = path.join(root, 'astro/components/sections');
		const files = (await walk(sectionsRoot)).filter(
			(file) => file.endsWith('.astro') && !file.includes(`${path.sep}blog${path.sep}`),
		);
		const sources = await Promise.all(files.map((file) => readFile(file, 'utf8')));
		const migratedSections = sources.filter((source) => source.includes('<Section'));
		const sectionComponent = await readFile(path.join(root, 'astro/components/layout/Section.astro'), 'utf8');
		const containerComponent = await readFile(path.join(root, 'astro/components/layout/Container.astro'), 'utf8');

		expect(migratedSections).toHaveLength(61);
		expect(migratedSections.every((source) => source.includes("layout/Section.astro"))).toBe(true);
		expect(migratedSections.every((source) => !source.includes('<section'))).toBe(true);
		expect(migratedSections.every((source) => !/^<Section[^>]*class="hidden/m.test(source))).toBe(true);
		expect(sectionComponent).toContain('contained?: boolean');
		expect(sectionComponent).toContain('contained={contained}');
		expect(containerComponent).toContain('contained ?');
	});

	it('reuses shared payroll sections across page variants', async () => {
		const pages = await Promise.all(
			['contractor-of-record.astro', 'enterprise-payroll.astro', 'mid-size-business-payroll.astro'].map(
				(file) => readFile(path.join(root, 'astro/pages', file), 'utf8'),
			),
		);
		const [contractor, enterprise, midSize] = pages;
		const payrollSections = path.join(root, 'astro/components/sections/payroll');
		const removedDuplicates = [
			'ContractorDifferentiatorsSection.astro',
			'EnterpriseDifferentiatorsSection.astro',
			'MidSizeDifferentiatorsSection.astro',
			'EnterpriseSolutionsSection.astro',
			'MidSizeSolutionsSection.astro',
			'MidSizeContractorBenefitsSection.astro',
		];

		expect(contractor).toContain('<GarnaDifferentiatorsSection ctaVariant="compact" />');
		expect(enterprise).toContain('<BusinessSolutionsSection audience="enterprise" />');
		expect(midSize).toContain('<BusinessSolutionsSection audience="growing" />');
		expect(contractor).toContain('<ContractorBenefitsSection />');
		expect(midSize).toContain('<ContractorBenefitsSection />');
		for (const duplicate of removedDuplicates) {
			await expect(access(path.join(payrollSections, duplicate))).rejects.toThrow();
		}
	});

	it('keeps payroll testimonial assets free of legacy duplicates', async () => {
		const testimonialAssets = await readdir(
			path.join(root, 'static/pages/payroll-small-business/assets'),
		);

		expect(testimonialAssets.sort()).toEqual([
			'testimonial-emma-v2.jpg',
			'testimonial-michael-v2.jpg',
			'testimonial-sofia-v2.jpg',
		]);
		await expect(access(path.join(root, 'public/pages'))).rejects.toThrow();
	});

	it('shares an accessible content-tabs interaction across EOR and enterprise payroll', async () => {
		const contentTabs = await readFile(
			path.join(root, 'astro/components/ui/ContentTabs.astro'),
			'utf8',
		);
		const sections = await Promise.all(
			['EorWhyGarnaSection.astro', 'EnterprisePlatformSection.astro'].map((file) =>
				readFile(path.join(root, 'astro/components/sections/payroll', file), 'utf8'),
			),
		);

		expect(sections.every((source) => source.includes("ui/ContentTabs.astro"))).toBe(true);
		expect(sections.every((source) => source.includes('<ContentTabs class="why-garna mt-12">'))).toBe(true);
		expect(contentTabs).toContain("setAttribute('role', 'tablist')");
		expect(contentTabs).toContain("setAttribute('role', 'tab')");
		expect(contentTabs).toContain("setAttribute('role', 'tabpanel')");
		expect(contentTabs).toContain("event.key === 'ArrowRight'");
		expect(contentTabs).toContain("event.key === 'ArrowLeft'");
	});

	it('builds EOR content cards with the shared Card and isolated HTML visuals', async () => {
		const sectionNames = [
			'GlobalWorkforceBenefitsSection.astro',
			'GlobalHiringFeaturesSection.astro',
			'EorFitSection.astro',
			'EorStepsSection.astro',
		];
		const sectionsRoot = path.join(root, 'astro/components/sections/payroll');
		const sources = await Promise.all(sectionNames.map((file) => readFile(path.join(sectionsRoot, file), 'utf8')));
		const combined = sources.join('\n');
		const visualNames = [
			'EorEntityHiringVisual.astro',
			'EorWorkforceMixVisual.astro',
			'EorPayrollRunVisual.astro',
			'EorComplianceVisual.astro',
			'EorIntegrationsVisual.astro',
			'EorFastMovingVisual.astro',
			'EorCompanyAccountStepVisual.astro',
			'EorFinancialContactStepVisual.astro',
			'EorContractStepVisual.astro',
			'EorInviteStepVisual.astro',
			'EorWalletStepVisual.astro',
		];

		expect(sources.every((source) => source.includes("ui/Card.astro"))).toBe(true);
		expect(combined.match(/<Card\b/g)).toHaveLength(20);
		expect(combined).not.toContain('<article class="surface-soft');
		expect(combined).toContain('data-eor-card-scroll-prev');
		expect(combined).toContain('data-eor-card-scroll-next');
		expect(combined).toContain('id="eor-card-workforce"');
		expect(combined.match(/lg:col-span-2/g)).toHaveLength(3);
		expect(combined.match(/lg:col-span-3/g)).toHaveLength(2);
		for (const visual of visualNames) await expect(access(path.join(root, 'astro/components/visuals', visual))).resolves.toBeUndefined();
	});

	it('keeps the shorter column sticky in EOR split sections and split FAQ on desktop', async () => {
		const sources = await Promise.all([
			readFile(path.join(root, 'astro/components/sections/payroll/GlobalWorkforceBenefitsSection.astro'), 'utf8'),
			readFile(path.join(root, 'astro/components/sections/payroll/EorFitSection.astro'), 'utf8'),
			readFile(path.join(root, 'astro/components/sections/FAQSection.astro'), 'utf8'),
		]);

		expect(sources.every((source) => source.includes('data-sticky-column'))).toBe(true);
		expect(sources.every((source) => source.includes('lg:sticky lg:top-28 lg:self-start'))).toBe(true);
		expect(sources.every((source) => !source.includes(' sticky '))).toBe(true);
	});

	it('keeps legacy surface aliases mapped to the shared card tokens', async () => {
		const globalStyles = await readFile(path.join(root, 'astro/styles/global.css'), 'utf8');
		const baseLayout = await readFile(path.join(root, 'astro/layouts/BaseLayout.astro'), 'utf8');
		const pageShells = await readFile(path.join(root, 'astro/content/page-shells.ts'), 'utf8');
		const rainbowStyles = await readFile(path.join(root, 'static/rainbow-bg.css'), 'utf8');

		expect(globalStyles).toContain('--garna-page-bg: #101010;');
		expect(globalStyles).toContain('--color-garna-page: #101010;');
		expect(globalStyles).toContain('--color-garna-accent: #CBF300;');
		expect(globalStyles).toContain('--garna-accent: #CBF300;');
		expect(globalStyles).toContain('--garna-accent-foreground: #101010;');
		expect(globalStyles).toContain('body[data-garna-page] {');
		expect(baseLayout).toContain("bodyClass = 'antialiased overflow-x-hidden bg-garna-page'");
		expect(baseLayout).toContain('<body class={bodyClass} data-garna-page>');
		expect(pageShells).not.toContain('bg-[#050505]');
		expect(rainbowStyles).toContain('background-color: rgba(16, 16, 16, 1);');
		expect(rainbowStyles).not.toContain('rgba(5, 5, 5, 1)');
		expect(globalStyles).toContain('.surface-soft {');
		expect(globalStyles).toContain('background: var(--garna-surface);');
		expect(globalStyles).toContain('border: 1px solid rgba(255, 255, 255, 0.05);');
	});

	it('keeps the retired green accent out of runtime sources', async () => {
		const runtimeRoots = ['astro', 'src', 'static', 'scripts'];
		const runtimeFiles = (await Promise.all(runtimeRoots.map((directory) => walk(path.join(root, directory)))))
			.flat()
			.filter((file) => /\.(?:astro|css|html|js|mjs|ts|tsx)$/.test(file) && !file.includes(`${path.sep}build${path.sep}`));
		const staleAccentFiles = (
			await Promise.all(
				runtimeFiles.map(async (file) => {
					const source = await readFile(file, 'utf8');
					return /#5ea500|rgba?\(94\s*,\s*165\s*,\s*0/i.test(source) ? file : null;
				}),
			)
		).filter((file): file is string => Boolean(file));

		expect(staleAccentFiles).toEqual([]);
	});

	it('keeps hero, section, and card subtitles on one typography contract', async () => {
		const globalStyles = await readFile(path.join(root, 'astro/styles/global.css'), 'utf8');
		const hero = await readFile(path.join(root, 'astro/components/sections/HeroSection.astro'), 'utf8');
		const sectionHeader = await readFile(path.join(root, 'astro/components/layout/SectionHeader.astro'), 'utf8');
		const card = await readFile(path.join(root, 'astro/components/ui/Card.astro'), 'utf8');
		const blogArticleShell = await readFile(path.join(root, 'astro/pages/blog-article-shell.astro'), 'utf8');
		const sectionFiles = (await walk(path.join(root, 'astro/components/sections')))
			.filter((file) => file.endsWith('.astro') && !file.includes(`${path.sep}blog${path.sep}`));
		const unmarkedSubtitles: string[] = [];

		for (const file of sectionFiles) {
			const source = await readFile(file, 'utf8');
			if (/<\/h2>\s*<p(?!\s+data-garna-subtitle)/.test(source)) unmarkedSubtitles.push(file);
		}

		expect(globalStyles).toContain('--garna-subtitle-color: #b0b0b0;');
		expect(globalStyles).toContain('--garna-subtitle-weight: 600;');
		expect(globalStyles).toContain('[data-garna-subtitle] {');
		expect(hero).toContain('<p data-garna-subtitle class={descriptionClass}');
		expect(sectionHeader).toContain('data-garna-subtitle');
		expect(card).toContain('<p data-garna-subtitle data-card-description');
		expect(blogArticleShell).toContain('<p data-garna-subtitle class="leading-relaxed text-lg font-manrope pb-12">');
		expect(unmarkedSubtitles).toEqual([]);
	});

	it('keeps the small-business hero visual self-contained and desktop-positioned', async () => {
		const visual = await readFile(
			path.join(root, 'astro/components/visuals/SmallBusinessPayrollVisual.astro'),
			'utf8',
		);
		const pageStyles = await readFile(
			path.join(root, 'astro/components/sections/payroll/SmallBusinessSectionStyles.astro'),
			'utf8',
		);

		expect(visual).toContain('position: absolute;');
		expect(visual).toContain('width: min(42vw, 520px);');
		expect(visual).toContain('.dashboard-avatar img {');
		expect(visual).toContain('@media (prefers-reduced-motion: reduce)');
		expect(pageStyles).not.toContain('main > section:first-of-type .hero-console');
	});

	it('keeps the employee cost calculator on the shared Garna background contract', async () => {
		const page = await readFile(path.join(root, 'astro/pages/tax-calculator.astro'), 'utf8');
		const hero = await readFile(
			path.join(root, 'astro/components/sections/tax-calculator/TaxCalculatorHeroSection.astro'),
			'utf8',
		);
		const styles = await readFile(path.join(root, 'astro/styles/tax-calculator-seo.css'), 'utf8');

		expect(page).toContain('<BaseLayout shell={pageShells.taxCalculator} rainbowCount={6}>');
		expect(hero).not.toContain('tax-orb');
		expect(styles).toContain('.tax-faq { padding: 100px 0 130px !important; background: var(--garna-page-bg); }');
		expect(styles).toContain('.tax-trusted { padding: 65px 0; border-block: 1px solid rgba(255,255,255,.07); background: #080808;');
		expect(styles).toContain('background: var(--garna-accent); color: var(--garna-accent-foreground);');
	});

	it('keeps the small-business payroll automation graphic in a self-contained visual', async () => {
		const section = await readFile(
			path.join(root, 'astro/components/sections/payroll/SmallBusinessOverviewSection.astro'),
			'utf8',
		);
		const visual = await readFile(
			path.join(root, 'astro/components/visuals/PayrollAutomationVisual.astro'),
			'utf8',
		);
		const pageStyles = await readFile(
			path.join(root, 'astro/components/sections/payroll/SmallBusinessSectionStyles.astro'),
			'utf8',
		);

		expect(section).toContain("visuals/PayrollAutomationVisual.astro");
		expect(section).toContain('<PayrollAutomationVisual />');
		expect(visual).toContain('aria-label="Payroll automation visual"');
		expect(visual).toContain('.automation-core__ring {');
		expect(visual).toContain("[data-routine-layout='wide']");
		expect(visual).toContain('@media (prefers-reduced-motion: reduce)');
		expect(pageStyles).not.toContain('.payroll-routine-visual');
	});

	it('builds homepage cards through the shared Card contract and visual slots', async () => {
		const card = await readFile(path.join(root, 'astro/components/ui/Card.astro'), 'utf8');
		const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
		const homeCardSections = [
			'ManageGlobalPayrollSection.astro',
			'HireEmployeesWorldwideSection.astro',
			'ContractorPaymentsSection.astro',
			'WhyCompaniesChooseGarnaSection.astro',
			'TrustedByBuildersSection.astro',
		];
		const sources = await Promise.all(
			homeCardSections.map((file) =>
				readFile(path.join(root, 'astro/components/sections/payroll/home', file), 'utf8'),
			),
		);
		const visualFiles = [
			'AutomatedPayrollPlatformVisual.astro',
			'GlobalReachVisual.astro',
			'TransparentFeesVisual.astro',
			'PayoutMethodsVisual.astro',
			'MobilePayoutVisual.astro',
			'EarlyPayoutVisual.astro',
			'CardIconVisual.astro',
			'TestimonialAuthorVisual.astro',
		];

		expect(card).toContain("title?: string | CardText");
		expect(card).toContain("description?: string | CardText");
		expect(card).toContain("'text-base leading-relaxed'");
		expect(card).toContain('data-garna-subtitle');
		expect(card).toContain('data-card-description');
		const descriptionVariants = card.match(/const defaultDescriptionClasses = \{[\s\S]*?\n\};/)?.[0] || '';
		expect(descriptionVariants).not.toMatch(/text-(?:gray|zinc|slate|white|black|\[#)/);
		expect(card).toContain('interactive = true');
		expect(card).toContain("data-card-glow={interactive ? 'true' : undefined}");
		expect(card).toContain('--garna-card-glow-radius: 60vw;');
		expect(card).toContain('--garna-card-border-glow-radius: 14rem;');
		expect(card).toContain('background: radial-gradient(');
		expect(card).toContain('.garna-card::after');
		expect(card).toContain('-webkit-mask-composite: xor;');
		expect(card).toContain('mask-composite: exclude;');
		expect(card).toContain(".garna-card[data-card-glow='true']:hover::after");
		expect(card).toContain("document.addEventListener('pointermove'");
		expect(card).toContain("style.setProperty('--garna-card-glow-x'");
		expect(card).toContain("style.setProperty('--garna-card-glow-y'");
		expect(card).toContain(".garna-card[data-interactive='true']:hover");
		expect(card).not.toContain('background-color: rgba(255, 255, 255, 0.045)');
		expect(card).toContain('border-color: rgba(255, 255, 255, 0.15)');
		expect(card).toContain('<slot name="visual" />');
		expect(packageJson.scripts.dev).toContain('wrangler dev --live-reload');
		expect(sources.every((source) => source.includes("ui/Card.astro"))).toBe(true);
		expect(sources.reduce((count, source) => count + (source.match(/<Card(?:\s|>)/g)?.length || 0), 0)).toBe(25);
		expect(sources.every((source) => !source.includes('<div class="glass-card'))).toBe(true);
		for (const file of visualFiles) {
			await expect(access(path.join(root, 'astro/components/visuals', file))).resolves.toBeUndefined();
		}
	});
});
