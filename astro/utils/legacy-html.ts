export function stripLegacyRainbowBackground(html: string): string {
	const start = html.search(/<!--\s*Rainbow background\s*-->\s*<div\s+class=["']rainbow-bg["'][^>]*>/i);
	const fallbackStart = start >= 0 ? start : html.search(/<div\s+class=["']rainbow-bg["'][^>]*>/i);
	if (fallbackStart < 0) return html;

	const openMatch = html.slice(fallbackStart).match(/<div\s+class=["']rainbow-bg["'][^>]*>/i);
	if (!openMatch || openMatch.index === undefined) return html;

	const blockStart = fallbackStart + openMatch.index;
	let cursor = blockStart;
	let depth = 0;
	const tagPattern = /<\/?div\b[^>]*>/gi;
	tagPattern.lastIndex = blockStart;

	let match: RegExpExecArray | null;
	while ((match = tagPattern.exec(html)) !== null) {
		if (match[0].startsWith('</')) {
			depth -= 1;
			if (depth === 0) {
				const blockEnd = tagPattern.lastIndex;
				return `${html.slice(0, blockStart)}${html.slice(blockEnd)}`;
			}
		} else {
			depth += 1;
		}
		cursor = tagPattern.lastIndex;
	}

	return html.slice(0, cursor);
}

export interface LegacySectionFragment {
	before: string;
	after: string;
	innerHtml: string;
	className: string;
	id?: string;
}

interface SplitLegacyPageOptions {
	heroVisualMarker?: string;
}

export function stripLegacyOuterMain(html: string): string {
	const trimmed = html.trim();
	if (!/^<main(?:\s[^>]*)?>/i.test(trimmed) || !/<\/main>$/i.test(trimmed)) return html;

	return trimmed.replace(/^<main(?:\s[^>]*)?>/i, '').replace(/<\/main>$/i, '');
}

export function extractFirstLegacySection(html: string): LegacySectionFragment | null {
	const openMatch = html.match(/<section\b[^>]*>/i);
	if (!openMatch || openMatch.index === undefined) return null;

	const sectionStart = openMatch.index;
	const openTag = openMatch[0];
	const openEnd = sectionStart + openTag.length;
	const tagPattern = /<\/?section\b[^>]*>/gi;
	tagPattern.lastIndex = sectionStart;

	let depth = 0;
	let match: RegExpExecArray | null;
	while ((match = tagPattern.exec(html)) !== null) {
		if (match[0].startsWith('</')) {
			depth -= 1;
			if (depth === 0) {
				const sectionEnd = tagPattern.lastIndex;
				return {
					before: html.slice(0, sectionStart),
					after: html.slice(sectionEnd),
					innerHtml: html.slice(openEnd, match.index),
					className: readAttribute(openTag, 'class') || '',
					id: readAttribute(openTag, 'id') || undefined,
				};
			}
		} else {
			depth += 1;
		}
	}

	return null;
}

export function splitLegacyPageSections(
	html: string,
	options: SplitLegacyPageOptions = {},
): { heroVisualHtml: string; contentHtml: string } {
	const contentWithoutRainbow = stripLegacyRainbowBackground(html);
	const contentWithoutOuterMain = stripLegacyOuterMain(contentWithoutRainbow);
	const heroSection = extractFirstLegacySection(contentWithoutOuterMain);

	if (!heroSection) {
		return {
			heroVisualHtml: '',
			contentHtml: contentWithoutOuterMain,
		};
	}

	return {
		heroVisualHtml: extractHeroVisualHtml(heroSection.innerHtml, options.heroVisualMarker),
		contentHtml: `${heroSection.before}${heroSection.after}`,
	};
}

function extractHeroVisualHtml(html: string, marker?: string): string {
	if (!marker) return '';

	const markerIndex = html.indexOf(marker);
	if (markerIndex < 0) return '';

	const firstDivAfterMarker = html.slice(markerIndex).search(/<div\b/i);
	if (firstDivAfterMarker < 0) return html.slice(markerIndex);

	const visualStart = markerIndex + firstDivAfterMarker;
	const visualEnd = findMatchingTagEnd(html, visualStart, 'div');
	if (!visualEnd) return html.slice(markerIndex);

	return `${html.slice(markerIndex, visualStart)}${html.slice(visualStart, visualEnd)}`;
}

function findMatchingTagEnd(html: string, startIndex: number, tagName: string): number | null {
	const tagPattern = new RegExp(`</?${tagName}\\b[^>]*>`, 'gi');
	tagPattern.lastIndex = startIndex;

	let depth = 0;
	let match: RegExpExecArray | null;
	while ((match = tagPattern.exec(html)) !== null) {
		if (match[0].startsWith('</')) {
			depth -= 1;
			if (depth === 0) return tagPattern.lastIndex;
		} else {
			depth += 1;
		}
	}

	return null;
}

function readAttribute(tag: string, name: string): string | null {
	const pattern = new RegExp(`${name}=["']([^"']*)["']`, 'i');
	return tag.match(pattern)?.[1] || null;
}
