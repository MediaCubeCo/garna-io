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
	it('keeps all 20 public and Worker-template entrypoints', async () => {
		const pages = (await walk(path.join(root, 'astro/pages'))).filter((file) => file.endsWith('.astro'));
		expect(pages).toHaveLength(20);
		expect(pages.some((file) => file.includes(`${path.sep}pages${path.sep}en${path.sep}`))).toBe(false);
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
			path.join(root, 'astro/components/sections/payroll/PayrollSolutionSections.astro'),
			'utf8',
		);

		expect(source).toContain('<span class="text-[#61afef]">create</span>(&#123;');
		expect(source).toContain('<div class="whitespace-nowrap">&#125;);</div>');
		expect(source).not.toContain('<span class="text-[#61afef]">create</span>({');
	});
});
