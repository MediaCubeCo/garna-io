/**
 * Returns a short client ID derived from email (SHA-1, 40 hex chars).
 * Normalizes input (trim + lowercase) for stable hashing across webhook and gtag.
 * Returns empty string if input is empty or Web Crypto is unavailable.
 */
export async function hashEmail(email: string): Promise<string> {
	const normalized = email.trim().toLowerCase();
	if (!normalized) return '';

	if (typeof crypto === 'undefined' || !crypto.subtle?.digest) {
		return '';
	}

	try {
		const msgUint8 = new TextEncoder().encode(normalized);
		const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	} catch {
		return '';
	}
}
