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
});
