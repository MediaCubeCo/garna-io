const UTM_PREFIX = 'utm_';

/** Cookie max-age for UTM persistence: 1 year (seconds). */
const UTM_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

declare global {
	interface Window {
		garnaPrivacy?: { hasConsent(category: string): boolean };
	}
}

/**
 * Parses URL query string and returns all utm_* params (keys lowercased).
 */
function getUtmFromUrl(): Record<string, string> {
	if (typeof window === 'undefined' || !window.location?.search) return {};
	const out: Record<string, string> = {};
	const params = new URLSearchParams(window.location.search);
	params.forEach((value, key) => {
		const lower = key.toLowerCase();
		if (lower.startsWith(UTM_PREFIX)) out[lower] = value;
	});
	return out;
}

/**
 * Writes UTM params to a single cookie (append to existing cookie string).
 * Each utm_* is stored as key=value with path=/ and max-age.
 */
function setUtmCookies(utm: Record<string, string>): void {
	if (typeof document === 'undefined') return;
	for (const [key, value] of Object.entries(utm)) {
		if (!value) continue;
		const encoded = encodeURIComponent(key) + '=' + encodeURIComponent(value);
		document.cookie = encoded + '; path=/; max-age=' + UTM_COOKIE_MAX_AGE + '; SameSite=Lax';
	}
}

/**
 * Writes UTM params to localStorage.
 */
function setUtmLocalStorage(utm: Record<string, string>): void {
	if (typeof localStorage === 'undefined') return;
	try {
		for (const [key, value] of Object.entries(utm)) {
			if (value != null) localStorage.setItem(key, value);
		}
	} catch {
		// ignore
	}
}

/**
 * Reads UTM params from the current page URL and persists them to cookies and localStorage.
 * Call this as soon as the user lands on the site (e.g. when the widget script loads).
 */
export function persistUtmFromUrl(): void {
	if (typeof window === 'undefined') return;
	if (!window.garnaPrivacy) {
		window.addEventListener('garna:privacy-updated', persistUtmFromUrl, { once: true });
		return;
	}
	if (!window.garnaPrivacy.hasConsent('marketing')) return;
	const utm = getUtmFromUrl();
	if (Object.keys(utm).length === 0) return;
	setUtmCookies(utm);
	setUtmLocalStorage(utm);
}

/**
 * Parses document.cookie into a key-value map.
 */
function parseCookies(): Record<string, string> {
	if (typeof document === 'undefined') return {};
	const out: Record<string, string> = {};
	const parts = document.cookie.split(';');
	for (const part of parts) {
		const eq = part.indexOf('=');
		if (eq === -1) continue;
		const key = decodeURIComponent(part.slice(0, eq).trim());
		const value = decodeURIComponent(part.slice(eq + 1).trim());
		if (key && key.toLowerCase().startsWith(UTM_PREFIX)) {
			out[key.toLowerCase()] = value;
		}
	}
	return out;
}

/**
 * Reads localStorage for keys that contain "utm_" (case-insensitive).
 */
function parseLocalStorage(): Record<string, string> {
	if (typeof localStorage === 'undefined') return {};
	const out: Record<string, string> = {};
	try {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.toLowerCase().includes(UTM_PREFIX)) {
				const normalizedKey = key.toLowerCase();
				const value = localStorage.getItem(key);
				if (value != null) out[normalizedKey] = value;
			}
		}
	} catch {
		// ignore
	}
	return out;
}

/**
 * Collects all UTM parameters from cookies and localStorage.
 * Keys are normalized to lowercase (e.g. utm_source, utm_medium).
 * Order: cookies first, then localStorage — localStorage wins on duplicate keys.
 */
export function collectUtmParams(): Record<string, string> {
	const fromCookies = parseCookies();
	const fromStorage = parseLocalStorage();
	return { ...fromCookies, ...fromStorage };
}

export interface FormAttribution {
	/** Campaign tags. Saved landing values in localStorage win over the current URL. */
	utm: Record<string, string>;
	/** Full address of the page the form is submitted from. Not written to storage. */
	pageUrl: string;
}

function nonEmpty(record: Record<string, string>): Record<string, string> {
	const out: Record<string, string> = {};
	for (const [key, value] of Object.entries(record)) {
		if (value != null && value !== '') out[key] = value;
	}
	return out;
}

/**
 * Merges UTM bags for a form submit.
 * Current URL fills gaps. Cookies override the URL. localStorage overrides both,
 * because landing tags are written there and that copy is what forms should send.
 */
export function mergeFormUtm(
	fromUrl: Record<string, string>,
	fromCookies: Record<string, string>,
	fromStorage: Record<string, string>,
): Record<string, string> {
	return nonEmpty({ ...fromUrl, ...fromCookies, ...fromStorage });
}

/**
 * Attribution captured at form submit.
 * Stored UTM exists only after marketing consent. UTM still present on the
 * current URL fills any key that was not saved. localStorage wins on duplicates.
 */
export function collectFormAttribution(): FormAttribution {
	const pageUrl = typeof window === 'undefined' ? '' : window.location.href;
	return {
		utm: mergeFormUtm(getUtmFromUrl(), parseCookies(), parseLocalStorage()),
		pageUrl,
	};
}

/** Cal.com rejects a booking when a metadata value is longer than this. */
const CAL_METADATA_VALUE_MAX = 500;
const CAL_METADATA_KEY_MAX = 40;

/**
 * Turns attribution fields into Cal.com embed config (`metadata[key]=value`).
 * Values are truncated to Cal.com's metadata limit.
 */
export function toCalMetadataConfig(fields: Record<string, string>): Record<string, string> {
	const config: Record<string, string> = {};
	for (const [key, value] of Object.entries(fields)) {
		if (!value) continue;
		const safeKey = key.replace(/[^\w]/g, '').slice(0, CAL_METADATA_KEY_MAX);
		if (!safeKey) continue;
		config[`metadata[${safeKey}]`] = value.slice(0, CAL_METADATA_VALUE_MAX);
	}
	return config;
}
