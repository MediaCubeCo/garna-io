import { getKybConfigForCountry, isKybApplicationDraft, migrateKybDraft, validateEntireKybApplication } from '../utils/kyb-flow';
import { formatKybQuestionnaireEmail, kybNotifyRecipients } from '../utils/kyb-notification';

const MAX_BODY_BYTES = 100_000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recentSubmissions = new Map<string, number[]>();

export type KybQuestionnaireEnv = {
	EMAIL?: {
		send: (message: {
			to: string | string[];
			from: { email: string; name?: string };
			replyTo?: { email: string; name?: string };
			subject: string;
			html: string;
			text: string;
		}) => Promise<unknown>;
	};
	EMAIL_FROM?: string;
	KYB_NOTIFY_EMAILS?: string;
};

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
	});

const allowSubmission = (ip: string, now = Date.now()) => {
	const stamps = (recentSubmissions.get(ip) || []).filter((stamp) => now - stamp < RATE_WINDOW_MS);
	if (stamps.length >= MAX_PER_WINDOW) {
		recentSubmissions.set(ip, stamps);
		return false;
	}
	stamps.push(now);
	recentSubmissions.set(ip, stamps);
	if (recentSubmissions.size > 500) {
		for (const [key, values] of recentSubmissions) {
			const fresh = values.filter((stamp) => now - stamp < RATE_WINDOW_MS);
			if (fresh.length) recentSubmissions.set(key, fresh);
			else recentSubmissions.delete(key);
		}
	}
	return true;
};

const safeMeta = (value: unknown, maxLength: number) => (typeof value === 'string' ? value.replace(/[\r\n]+/g, ' ').trim().slice(0, maxLength) : '');

export async function handleKybQuestionnaire(request: Request, env: KybQuestionnaireEnv): Promise<Response | null> {
	const url = new URL(request.url);
	if (url.pathname !== '/api/business-account/questionnaire') return null;
	if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

	const declaredLength = Number(request.headers.get('content-length') || '');
	if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return json({ error: 'Payload too large' }, 413);

	const raw = await request.text();
	if (raw.length > MAX_BODY_BYTES) return json({ error: 'Payload too large' }, 413);

	let payload: unknown;
	try {
		payload = JSON.parse(raw);
	} catch {
		return json({ error: 'Invalid JSON' }, 400);
	}

	const body = payload && typeof payload === 'object' ? payload as { application?: unknown; locale?: unknown; page?: unknown } : {};
	const application = 'application' in body ? body.application : payload;
	if (!isKybApplicationDraft(application)) return json({ error: 'Invalid questionnaire' }, 400);

	const draft = migrateKybDraft(application);
	const validation = validateEntireKybApplication(draft, getKybConfigForCountry(draft.company.country));
	if (!validation.valid) return json({ error: 'Incomplete questionnaire' }, 400);
	if (!env.EMAIL) return json({ error: 'Email is not configured' }, 503);

	const ip = request.headers.get('cf-connecting-ip') || 'unknown';
	if (!allowSubmission(ip)) return json({ error: 'Too many submissions' }, 429);

	const message = formatKybQuestionnaireEmail(draft, {
		locale: safeMeta(body.locale, 8),
		page: safeMeta(body.page, 200),
		submittedAt: new Date().toISOString(),
	});

	try {
		await env.EMAIL.send({
			to: kybNotifyRecipients(env.KYB_NOTIFY_EMAILS),
			from: { email: env.EMAIL_FROM || 'noreply@garna.io', name: 'Garna' },
			...(message.replyTo ? { replyTo: message.replyTo } : {}),
			subject: message.subject,
			html: message.html,
			text: message.text,
		});
	} catch (error) {
		console.error(JSON.stringify({
			event: 'kyb_questionnaire_email_failed',
			message: error instanceof Error ? error.message : 'unknown',
		}));
		return json({ error: 'Submission failed' }, 502);
	}

	return json({ ok: true });
};
