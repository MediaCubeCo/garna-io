import type { AdminSession, BlogEnv } from './types';
import { parseCookie, randomToken, sha256Hex } from './utils';

const SESSION_COOKIE = 'garna_blog_session';
const MAGIC_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export function getAllowedAdminEmails(env: BlogEnv): Set<string> {
	return new Set(
		(env.ADMIN_EMAILS || '')
			.split(',')
			.map((email) => email.trim().toLowerCase())
			.filter(Boolean)
	);
}

export function isAllowedAdminEmail(env: BlogEnv, email: string): boolean {
	const allowed = getAllowedAdminEmails(env);
	return allowed.size > 0 && allowed.has(email.trim().toLowerCase());
}

export async function createMagicLink(env: BlogEnv, email: string, origin: string): Promise<string> {
	if (!env.DB) throw new Error('D1 DB binding is required');
	const token = randomToken();
	const hash = await sha256Hex(`${env.MAGIC_LINK_SECRET || 'dev'}:${token}`);
	const expiresAt = new Date(Date.now() + MAGIC_TTL_MS).toISOString();
	await env.DB.prepare('INSERT INTO magic_links (email, token_hash, expires_at) VALUES (?, ?, ?)')
		.bind(email.trim().toLowerCase(), hash, expiresAt)
		.run();
	return `${origin}/admin/blog/callback?token=${encodeURIComponent(token)}`;
}

export async function consumeMagicLink(env: BlogEnv, token: string): Promise<string | null> {
	if (!env.DB) return null;
	const hash = await sha256Hex(`${env.MAGIC_LINK_SECRET || 'dev'}:${token}`);
	const row = await env.DB.prepare(
		`SELECT email, expires_at, used_at FROM magic_links WHERE token_hash = ?`
	)
		.bind(hash)
		.first<{ email: string; expires_at: string; used_at: string | null }>();
	if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) return null;
	await env.DB.prepare('UPDATE magic_links SET used_at = CURRENT_TIMESTAMP WHERE token_hash = ?').bind(hash).run();
	return row.email;
}

export async function createSession(env: BlogEnv, email: string): Promise<{ token: string; cookie: string }> {
	if (!env.DB) throw new Error('D1 DB binding is required');
	const token = randomToken();
	const hash = await sha256Hex(`${env.SESSION_SECRET || 'dev'}:${token}`);
	const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
	await env.DB.prepare('INSERT INTO admin_sessions (email, session_hash, expires_at) VALUES (?, ?, ?)')
		.bind(email.trim().toLowerCase(), hash, expiresAt)
		.run();
	return {
		token,
		cookie: `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
	};
}

export async function getSession(request: Request, env: BlogEnv): Promise<AdminSession | null> {
	if (!env.DB) return null;
	const token = parseCookie(request.headers.get('Cookie'))[SESSION_COOKIE];
	if (!token) return null;
	const hash = await sha256Hex(`${env.SESSION_SECRET || 'dev'}:${token}`);
	const row = await env.DB.prepare('SELECT email, expires_at FROM admin_sessions WHERE session_hash = ?')
		.bind(hash)
		.first<AdminSession>();
	if (!row || new Date(row.expires_at).getTime() < Date.now()) return null;
	return row;
}

export function clearSessionCookie(): string {
	return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}
