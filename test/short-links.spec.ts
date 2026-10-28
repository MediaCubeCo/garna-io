import { describe, expect, it } from 'vitest';
import worker from '../src/index';
import { handleShortLink } from '../src/routes/short-links';
import { shortLinks } from '../src/config/short-links';
import { readFileSync } from 'node:fs';

describe('Short links', () => {
	it.each([1, 2, 3, 4])('routes episode %i through the Worker with exact attribution', async (episode) => {
		const response = await worker.fetch(
			new Request(`https://garna.io/s/career-game-${episode}`, { headers: { 'Accept-Language': 'es' } }),
			{},
			{} as ExecutionContext,
		);
		expect(response.status).toBe(302);
		expect(response.headers.get('Location')).toBe(
			`https://garna.io/ru/podcast-offer?utm_source=bolshaya_karernaya_igra&utm_medium=podcast&utm_campaign=lopatina_ep${episode}`,
		);
		expect(response.headers.get('Cache-Control')).toBe('no-store');
	});

	it('keeps preview origin, accepts HEAD and trailing slash, and ignores incoming parameters', () => {
		const response = handleShortLink(new Request(
			'https://preview.example/s/career-game-1/?utm_campaign=wrong&url=https://example.com',
			{ method: 'HEAD' },
		));
		expect(response?.status).toBe(302);
		expect(response?.headers.get('Location')).toBe(
			'https://preview.example/ru/podcast-offer?utm_source=bolshaya_karernaya_igra&utm_medium=podcast&utm_campaign=lopatina_ep1',
		);
		expect(response?.body).toBeNull();
	});

	it.each(['/s', '/s/', '/s/unknown', '/s/toString', '/s/constructor', '/s/CAREER-game-1', '/s/career-game-1/extra'])(
		'returns 404 for unregistered path %s', (path) => {
			expect(handleShortLink(new Request(`https://garna.io${path}`))?.status).toBe(404);
		},
	);

	it('rejects POST and leaves ordinary routes to existing routing', () => {
		const response = handleShortLink(new Request('https://garna.io/s/career-game-1', { method: 'POST' }));
		expect(response?.status).toBe(405);
		expect(response?.headers.get('Allow')).toBe('GET, HEAD');
		for (const path of ['/ru/podcast-offer', '/en', '/sitemap-index.xml', '/something']) {
			expect(handleShortLink(new Request(`https://garna.io${path}`))).toBeNull();
		}
	});

	it('registers valid slugs and direct internal destinations without redirect loops', () => {
		for (const [slug, destination] of Object.entries(shortLinks)) {
			expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
			expect(destination.startsWith('/')).toBe(true);
			const target = new URL(destination, 'https://garna.io');
			expect(target.origin).toBe('https://garna.io');
			expect(target.pathname).not.toMatch(/^\/s(?:\/|$)/);
		}
	});

	it('reserves the namespace ahead of assets in production and preview', () => {
		const config = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
		const assetRoutes = [...config.matchAll(/run_worker_first = \[([\s\S]*?)\]/g)];
		expect(assetRoutes).toHaveLength(2);
		for (const [, routes] of assetRoutes) {
			expect(routes).toContain('"/s"');
			expect(routes).toContain('"/s/*"');
		}
	});
});
