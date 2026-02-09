/**
 * Sends events to GA/GTM via dataLayer (same pattern as youtube_transcript_generator).
 * Does not require window.gtag; creates dataLayer if needed and pushes event objects.
 */
declare global {
	interface Window {
		dataLayer?: unknown[];
	}
}

const LOG_PREFIX = '[garna widget] gtag';

export function sendGtagEvent(eventName: string, params?: Record<string, unknown>): void {
	const safeParams = params ?? {};
	if (typeof window === 'undefined') {
		console.log(`${LOG_PREFIX} skipped (no window):`, { eventName, params: safeParams });
		return;
	}
	if (!Array.isArray(window.dataLayer)) {
		window.dataLayer = [];
	}
	const eventData = { event: eventName, ...safeParams };
	console.log(`${LOG_PREFIX} sending event:`, {
		eventName,
		params: safeParams,
		timestamp: new Date().toISOString(),
	});
	window.dataLayer.push(eventData);
	console.log(`${LOG_PREFIX} event sent:`, eventName);
}
