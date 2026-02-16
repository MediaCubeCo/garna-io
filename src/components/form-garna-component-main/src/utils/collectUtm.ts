const UTM_PREFIX = 'utm_';

/** Cookie max-age for UTM persistence: 1 year (seconds). */
const UTM_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

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
