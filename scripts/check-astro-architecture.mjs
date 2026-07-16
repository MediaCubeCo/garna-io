import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const astroRoot = path.join(root, 'astro');
const allowedSetHtml = path.join(astroRoot, 'components/sections/blog/TrustedDynamicHead.astro');

const forbiddenPatterns = [
	['raw page import', /\?raw\b/],
	['legacy section extractor', /splitLegacyPageSections/],
	['legacy page content import', /content\/site-(?:pages|heads|scripts|standalone|hero-visuals)/],
	['intermediate component category', /components\/(?:pages|dynamic)\//],
	['Tailwind browser runtime', /cdn\.tailwindcss\.com/],
	['page-level script string', /scriptsHtml/],
	['page-level head string', /headExtra/],
];

const forbiddenDirectories = [
	'site-pages',
	'site-heads',
	'site-scripts',
	'site-standalone',
	'site-hero-visuals',
].map((name) => path.join(astroRoot, 'content', name)).concat([
	path.join(astroRoot, 'components/pages'),
	path.join(astroRoot, 'components/dynamic'),
]);

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const absolute = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(absolute)));
		else files.push(absolute);
	}
	return files;
}

export async function getArchitectureViolations() {
	const violations = [];
	const files = (await walk(astroRoot)).filter((file) => /\.(?:astro|ts|css)$/.test(file));

	for (const file of files) {
		const source = await readFile(file, 'utf8');
		const relative = path.relative(root, file);
		for (const [label, pattern] of forbiddenPatterns) {
			if (pattern.test(source)) violations.push(`${relative}: ${label}`);
		}
		if (file !== allowedSetHtml && /set:html=/.test(source)) {
			violations.push(`${relative}: set:html outside the trusted dynamic-content allowlist`);
		}
	}

	for (const directory of forbiddenDirectories) {
		try {
			await access(directory);
			violations.push(`${path.relative(root, directory)}: legacy runtime directory still exists`);
		} catch {
			// Expected: legacy runtime directories are absent.
		}
	}

	return violations;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const violations = await getArchitectureViolations();
	if (violations.length) {
		console.error(`Astro architecture check failed:\n${violations.map((item) => `- ${item}`).join('\n')}`);
		process.exitCode = 1;
	} else {
		console.log('Astro architecture check passed.');
	}
}
