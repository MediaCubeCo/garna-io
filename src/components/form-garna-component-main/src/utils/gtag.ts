/**
 * Safe gtag event helper. Only sends when window.gtag is available (e.g. GA4 loaded on host page).
 */
declare global {
	interface Window {
		gtag?: (command: 'event', eventName: string, eventParams?: Record<string, unknown>) => void;
	}
}

export function sendGtagEvent(eventName: string, params?: Record<string, unknown>): void {
	if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
		window.gtag('event', eventName, params ?? {});
	}
}
