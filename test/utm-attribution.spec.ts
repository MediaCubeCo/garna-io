import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { mergeFormUtm } from '../src/components/form-garna-component-main/src/utils/collectUtm';
import { injectPrivacyManager } from '../src/utils/privacy-ui';
import { injectUtmPersistence, utmPersistenceScript } from '../src/utils/utm-persistence';

function storage(initial: Record<string, string> = {}) {
	const map = new Map(Object.entries(initial));
	return {
		map,
		api: {
			getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
			setItem: (key: string, value: string) => {
				map.set(key, String(value));
			},
			removeItem: (key: string) => {
				map.delete(key);
			},
		},
	};
}

function createHarness(initial: {
	search?: string;
	cookie?: string;
	localStorage?: Record<string, string>;
	garnaPrivacy?: { hasConsent(category: string): boolean };
} = {}) {
	const local = storage(initial.localStorage);
	const session = storage();
	const cookies = initial.cookie ? [initial.cookie] : [];
	const listeners = new Map<string, Array<(event: { detail?: unknown }) => void>>();
	const document = {};
	Object.defineProperty(document, 'cookie', {
		get: () => cookies.join('; '),
		set: (value: string) => {
			const pair = String(value).split(';')[0];
			const name = pair.slice(0, pair.indexOf('='));
			const index = cookies.findIndex((item) => item.startsWith(`${name}=`));
			if (index >= 0) cookies[index] = pair;
			else cookies.push(pair);
		},
	});
	const window = {
		location: { search: initial.search || '' },
		garnaPrivacy: initial.garnaPrivacy,
		addEventListener(type: string, fn: (event: { detail?: unknown }) => void) {
			const list = listeners.get(type) || [];
			list.push(fn);
			listeners.set(type, list);
		},
	};
	const sandbox = vm.createContext({
		window,
		document,
		localStorage: local.api,
		sessionStorage: session.api,
		URLSearchParams,
		encodeURIComponent,
		decodeURIComponent,
		JSON,
		Object,
	});
	vm.runInContext(utmPersistenceScript(), sandbox);
	return {
		local: local.map,
		session: session.map,
		cookies,
		document,
		setSearch(search: string) {
			window.location.search = search;
		},
		setPrivacy(garnaPrivacy: { hasConsent(category: string): boolean }) {
			window.garnaPrivacy = garnaPrivacy;
		},
		dispatch(type: string) {
			for (const fn of listeners.get(type) || []) fn({});
		},
	};
}

function privacyCookie(marketing: boolean): string {
	return `garna_privacy_v1=${encodeURIComponent(JSON.stringify({ version: 1, marketing }))}`;
}

describe('form UTM priority', () => {
	it('sends saved localStorage tags ahead of the current URL and cookies', () => {
		expect(mergeFormUtm(
			{ utm_source: 'url', utm_medium: 'cpc' },
			{ utm_source: 'cookie', utm_campaign: 'cookie-campaign' },
			{ utm_source: 'stored', utm_term: 'brand' },
		)).toEqual({
			utm_source: 'stored',
			utm_medium: 'cpc',
			utm_campaign: 'cookie-campaign',
			utm_term: 'brand',
		});
	});
});

describe('landing UTM persistence', () => {
	it('keeps landing tags until marketing consent, then stores them', () => {
		const page = createHarness({ search: '?utm_source=google&utm_campaign=spring&gclid=abc' });

		expect(page.local.size).toBe(0);
		expect(JSON.parse(page.session.get('garna_utm_pending') || '{}')).toEqual({
			utm_source: 'google',
			utm_campaign: 'spring',
		});

		page.setSearch('');
		page.setPrivacy({ hasConsent: (category) => category === 'marketing' });
		page.dispatch('garna:privacy-updated');

		expect(page.local.get('utm_source')).toBe('google');
		expect(page.local.get('utm_campaign')).toBe('spring');
		expect(page.local.has('gclid')).toBe(false);
		expect(page.session.has('garna_utm_pending')).toBe(false);
		expect(page.cookies.some((cookie) => cookie.startsWith('utm_source='))).toBe(true);
	});

	it('writes immediately when marketing consent is already saved', () => {
		const page = createHarness({
			search: '?utm_medium=cpc',
			cookie: privacyCookie(true),
			localStorage: { utm_source: 'google' },
		});

		expect(page.local.get('utm_medium')).toBe('cpc');
		expect(page.local.get('utm_source')).toBe('google');

		page.setSearch('?utm_source=facebook');
		page.dispatch('garna:page-content-updated');

		expect(page.local.get('utm_source')).toBe('facebook');
		expect(page.local.get('utm_medium')).toBe('cpc');
	});

	it('drops the pending landing tags when marketing stays off', () => {
		const page = createHarness({ search: '?utm_source=google' });
		page.document.cookie = privacyCookie(false);
		page.setPrivacy({ hasConsent: () => false });
		page.dispatch('garna:privacy-updated');

		expect(page.local.size).toBe(0);
		expect(page.session.has('garna_utm_pending')).toBe(false);
	});
});

describe('UTM snippet injection', () => {
	it('adds the capture script once', () => {
		const html = '<html><head><title>Garna</title></head><body></body></html>';
		const once = injectUtmPersistence(html);
		const twice = injectUtmPersistence(once);
		expect(once).toContain('data-garna-utm');
		expect(once).toContain('localStorage.setItem');
		expect(twice).toBe(once);
		expect(() => new Function(utmPersistenceScript())).not.toThrow();
	});

	it('arrives with the privacy manager on pages that do not embed it', () => {
		const html = '<html><head><title>Garna</title></head><body><main>Page</main></body></html>';
		const injected = injectPrivacyManager(html, 'en');
		const again = injectPrivacyManager(injected, 'en');
		const localized = injectPrivacyManager(injected, 'ru');
		expect(injected.match(/data-garna-utm/g)).toHaveLength(1);
		expect(again).toBe(injected);
		expect(localized.match(/data-garna-utm/g)).toHaveLength(1);
		expect(localized).toContain('LANGUAGE="ru"');
	});
});
