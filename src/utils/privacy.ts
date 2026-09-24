export const PRIVACY_COOKIE_NAME = 'garna_privacy_v1';
export const PRIVACY_POLICY_VERSION = 1;

export type PrivacyProfile = 'strict_opt_in' | 'california' | 'us_opt_out' | 'notice';

export interface PrivacyChoices {
	necessary: true;
	preferences: boolean;
	analytics: boolean;
	marketing: boolean;
}

export interface PrivacyConsentState extends PrivacyChoices {
	version: number;
	profile: PrivacyProfile;
	updatedAt: string;
	gpc: boolean;
}

export interface PrivacyContext {
	version: number;
	profile: PrivacyProfile;
	requiresOptIn: boolean;
	gpc: boolean;
	defaults: PrivacyChoices;
}

type RequestWithCloudflareLocation = Request & {
	cf?: {
		country?: string | null;
		regionCode?: string | null;
		region?: string | null;
	};
};

const STRICT_OPT_IN_COUNTRIES = new Set([
	'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
	'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH', 'BR',
]);

function normalizeLocationPart(value: unknown): string {
	return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

export function hasGlobalPrivacyControl(request: Request): boolean {
	return request.headers.get('sec-gpc')?.trim() === '1';
}

export function resolvePrivacyProfile(request: Request): PrivacyProfile {
	const cf = (request as RequestWithCloudflareLocation).cf;
	const country = normalizeLocationPart(cf?.country || request.headers.get('cf-ipcountry'));
	const regionCode = normalizeLocationPart(cf?.regionCode || request.headers.get('x-garna-region-code'));
	const region = normalizeLocationPart(cf?.region);

	// Unknown edge location, including local development, gets the safest profile.
	if (!country) return 'strict_opt_in';
	if (country === 'US' && (regionCode === 'CA' || region === 'CALIFORNIA')) return 'california';
	if (country === 'US') return 'us_opt_out';
	if (country === 'CA' && (regionCode === 'QC' || region === 'QUEBEC' || region === 'QUÉBEC')) return 'strict_opt_in';
	if (STRICT_OPT_IN_COUNTRIES.has(country)) return 'strict_opt_in';
	return 'notice';
}

export function getPrivacyContext(request: Request): PrivacyContext {
	const profile = resolvePrivacyProfile(request);
	const gpc = hasGlobalPrivacyControl(request);
	const requiresOptIn = profile === 'strict_opt_in';

	return {
		version: PRIVACY_POLICY_VERSION,
		profile,
		requiresOptIn,
		gpc,
		defaults: {
			necessary: true,
			preferences: !requiresOptIn,
			analytics: !requiresOptIn && !gpc,
			// Cross-context attribution remains opt-in everywhere.
			marketing: false,
		},
	};
}

function readCookie(cookieHeader: string | null, name: string): string | null {
	if (!cookieHeader) return null;
	for (const segment of cookieHeader.split(';')) {
		const separator = segment.indexOf('=');
		if (separator === -1 || segment.slice(0, separator).trim() !== name) continue;
		return segment.slice(separator + 1).trim();
	}
	return null;
}

export function readPrivacyConsent(request: Request): PrivacyConsentState | null {
	const raw = readCookie(request.headers.get('cookie'), PRIVACY_COOKIE_NAME);
	if (!raw) return null;
	try {
		const value = JSON.parse(decodeURIComponent(raw)) as Partial<PrivacyConsentState>;
		if (value.version !== PRIVACY_POLICY_VERSION) return null;
		if (!['strict_opt_in', 'california', 'us_opt_out', 'notice'].includes(String(value.profile))) return null;
		if (typeof value.preferences !== 'boolean' || typeof value.analytics !== 'boolean' || typeof value.marketing !== 'boolean') return null;
		return {
			version: PRIVACY_POLICY_VERSION,
			profile: value.profile as PrivacyProfile,
			updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : '',
			gpc: value.gpc === true,
			necessary: true,
			preferences: value.preferences,
			analytics: value.analytics,
			marketing: value.marketing,
		};
	} catch {
		return null;
	}
}

export function effectivePrivacyChoices(request: Request): PrivacyChoices {
	const context = getPrivacyContext(request);
	const saved = readPrivacyConsent(request);
	let choices: PrivacyChoices = saved
		? { necessary: true, preferences: saved.preferences, analytics: saved.analytics, marketing: saved.marketing }
		: context.defaults;

	if (context.requiresOptIn && saved?.profile !== 'strict_opt_in') choices = context.defaults;
	if (context.gpc) choices = { ...choices, analytics: false, marketing: false };
	return choices;
}

export function handlePrivacyContextRequest(request: Request): Response | null {
	const url = new URL(request.url);
	if (url.pathname !== '/api/privacy/context') return null;
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
	}

	return new Response(request.method === 'HEAD' ? null : JSON.stringify(getPrivacyContext(request)), {
		status: 200,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'private, no-store, max-age=0',
			Vary: 'Sec-GPC',
			'X-Content-Type-Options': 'nosniff',
		},
	});
}

export function deferConsentManagedEmbeds(html: string): string {
	return html.replace(
		/(<iframe\b[^>]*?)\bsrc=(['"])(https:\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com\/embed\/|datawrapper\.dwcdn\.net\/)[^'"]+)\2([^>]*>)/gi,
		'$1src="about:blank" data-garna-privacy-src="$3" data-garna-privacy-category="analytics"$4',
	);
}
