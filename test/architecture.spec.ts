import { readFile, readdir } from 'node:fs/promises';
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
});
