import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('keeps Show all working after repeated mounts without duplicate click handlers', () => {
	const source = readFileSync(new URL('../astro/components/sections/payroll/EorCountriesSection.astro', import.meta.url), 'utf8');
	const script = source.slice(source.indexOf('<script>') + 8, source.indexOf('\n\tconst playgrounds =')) + '\n}; return { initCountries };';
	class Element extends EventTarget {
		dataset = {};
		style = { setProperty() {}, removeProperty() {} };
		classes = new Set<string>();
		attributes = new Map<string, string>();
		classList = {
			contains: (name: string) => this.classes.has(name),
			toggle: (name: string, on: boolean) => on ? this.classes.add(name) : this.classes.delete(name),
		};
		setAttribute(name: string, value: string) { this.attributes.set(name, value); }
		querySelectorAll() { return []; }
	}
	const buttons = Array.from({ length: 4 }, () => new Element());
	const regions = buttons.map((button) => Object.assign(new Element(), {
		querySelector: (selector: string) => selector === '[data-countries-toggle-button]' ? button : new Element(),
		closest: () => ({ querySelectorAll: () => regions }),
	}));
	const { initCountries } = new Function('document', 'window', 'HTMLElement', 'Element', 'requestAnimationFrame', script)(
		{ querySelectorAll: (selector: string) => selector === '[data-countries-region]' ? regions : [] },
		{ matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener() {} },
		Element, Element, (fn: () => void) => fn(),
	);
	for (let mount = 0; mount < 5; mount++) {
		initCountries();
		for (const button of buttons) {
			button.dispatchEvent(new Event('click'));
			expect(button.attributes.get('aria-expanded')).toBe('true');
			expect(regions.filter((region) => region.classList.contains('is-expanded'))).toHaveLength(1);
			button.dispatchEvent(new Event('click'));
			expect(button.attributes.get('aria-expanded')).toBe('false');
		}
	}
});
