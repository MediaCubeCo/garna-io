import { describe, expect, it } from 'vitest';
import {
	deferConsentManagedEmbeds,
	effectivePrivacyChoices,
	getPrivacyContext,
	handlePrivacyContextRequest,
	resolvePrivacyProfile,
} from '../src/utils/privacy';
import { injectPrivacyIntoResponse, injectPrivacyManager } from '../src/utils/privacy-ui';

function locatedRequest(country?: string, regionCode?: string, headers: Record<string, string> = {}): Request {
	const request = new Request('https://garna.io/api/privacy/context', { headers });
	Object.defineProperty(request, 'cf', { value: country ? { country, regionCode } : {}, configurable: true });
	return request;
}

function consentCookie(overrides: Record<string, unknown> = {}): string {
	return encodeURIComponent(JSON.stringify({
		version: 1,
		profile: 'strict_opt_in',
		updatedAt: '2026-09-24T00:00:00.000Z',
		gpc: false,
		necessary: true,
		preferences: false,
		analytics: true,
		marketing: false,
		...overrides,
	}));
}

describe('privacy region policy', () => {
	it('uses strict opt-in for GDPR-style regions and unknown locations', () => {
		expect(resolvePrivacyProfile(locatedRequest('DE'))).toBe('strict_opt_in');
		expect(resolvePrivacyProfile(locatedRequest('GB'))).toBe('strict_opt_in');
		expect(resolvePrivacyProfile(locatedRequest('BR'))).toBe('strict_opt_in');
		expect(resolvePrivacyProfile(locatedRequest())).toBe('strict_opt_in');
	});

	it('distinguishes California, other US states, and Quebec', () => {
		expect(resolvePrivacyProfile(locatedRequest('US', 'CA'))).toBe('california');
		expect(resolvePrivacyProfile(locatedRequest('US', 'NY'))).toBe('us_opt_out');
		expect(resolvePrivacyProfile(locatedRequest('CA', 'QC'))).toBe('strict_opt_in');
	});

	it('keeps marketing off by default and honors GPC', () => {
		expect(getPrivacyContext(locatedRequest('JP')).defaults.analytics).toBe(true);
		expect(getPrivacyContext(locatedRequest('JP')).defaults.marketing).toBe(false);
		const context = getPrivacyContext(locatedRequest('US', 'CA', { 'Sec-GPC': '1' }));
		expect(context.gpc).toBe(true);
		expect(context.defaults.analytics).toBe(false);
	});

	it('does not carry an opt-out-region choice into a strict region', () => {
		const request = locatedRequest('DE', undefined, {
			Cookie: `garna_privacy_v1=${consentCookie({ profile: 'us_opt_out' })}`,
		});
		expect(effectivePrivacyChoices(request).analytics).toBe(false);
	});

	it('returns a private, non-cacheable context response', async () => {
		const response = handlePrivacyContextRequest(locatedRequest('US', 'CA'));
		expect(response?.status).toBe(200);
		expect(response?.headers.get('cache-control')).toContain('no-store');
		expect(await response?.json()).toMatchObject({ profile: 'california', requiresOptIn: false });
	});
});

describe('privacy UI injection', () => {
	const html = '<html><head><title>Garna</title></head><body><main>Page</main></body></html>';

	it('injects localized, syntactically valid privacy controls once', () => {
		const once = injectPrivacyManager(html, 'ru');
		const twice = injectPrivacyManager(once, 'ru');
		expect(once).toContain('data-garna-privacy');
		expect(once).toContain('Ваша приватность');
		expect(twice).toBe(once);
		const script = once.match(/<script data-garna-privacy>([\s\S]*?)<\/script>/)?.[1];
		expect(script).toBeTruthy();
		expect(() => new Function(script!)).not.toThrow();
	});

	it('defers known third-party embeds', () => {
		const result = deferConsentManagedEmbeds('<iframe src="https://www.youtube.com/embed/video"></iframe>');
		expect(result).toContain('src="about:blank"');
		expect(result).toContain('data-garna-privacy-src="https://www.youtube.com/embed/video"');
	});

	it('preserves response status and headers while injecting by URL language', async () => {
		const response = await injectPrivacyIntoResponse(
			new Response(html, { status: 404, headers: { 'Content-Type': 'text/html', 'X-Test': 'yes' } }),
			new Request('https://garna.io/es/missing'),
		);
		expect(response.status).toBe(404);
		expect(response.headers.get('x-test')).toBe('yes');
		expect(await response.text()).toContain('Tu privacidad');
	});
});
