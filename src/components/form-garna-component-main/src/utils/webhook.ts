import type { IForm } from '../components/modal/modal';
import { collectUtmParams } from './collectUtm';

const N8N_WEBHOOK_URL = 'https://mediacube.app.n8n.cloud/webhook/24740331-652c-4731-a656-baf8d8f5cf38';

/** Supported language codes sent to the webhook. */
export type WebhookLanguage = 'en' | 'es' | 'pt' | 'ru';

export interface IWebhookPayload {
	firstName: string;
	lastName: string;
	email: string;
	numEmployes: string;
	language: WebhookLanguage;
	garnaClientID?: string;
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_term?: string;
	utm_content?: string;
	[key: string]: string | undefined;
}

/** Strips locale suffixes (people, employees, человек, etc.) and returns only the number/range. */
function employeesNumberOnly(value: string): string {
	return value
		.replace(/\s*(people|employees?|человек|empleados?|pessoas?|personas?)\s*$/gi, '')
		.trim() || value;
}

/**
 * Sends form data to the n8n webhook when the user completes step 1 and moves to step 2.
 * Fires once per transition; does not throw (failures are logged only).
 */
export type IFormWithGarnaClientID = IForm & { garnaClientID?: string; language?: string };

const LOG_PREFIX = '[garna widget] webhook';

export async function sendFormCompletedWebhook(form: IFormWithGarnaClientID): Promise<void> {
	const utm = collectUtmParams();
	const utmFields: Record<string, string> = {};
	for (const [key, value] of Object.entries(utm)) {
		if (value != null && value !== '') utmFields[key] = value;
	}

	const language: WebhookLanguage =
		form.language && ['en', 'es', 'pt', 'ru'].includes(form.language.toLowerCase())
			? (form.language.toLowerCase() as WebhookLanguage)
			: 'en';

	const payload: IWebhookPayload = {
		firstName: form.firstName,
		lastName: form.lastName,
		email: form.email,
		numEmployes: employeesNumberOnly(form.numEmployes),
		language,
		...(form.garnaClientID != null && form.garnaClientID !== '' ? { garnaClientID: form.garnaClientID } : {}),
		...utmFields,
	};

	console.log(`${LOG_PREFIX} sending form_completed:`, {
		url: N8N_WEBHOOK_URL,
		payload: {
			firstName: payload.firstName,
			lastName: payload.lastName,
			email: payload.email,
			numEmployes: payload.numEmployes,
			language: payload.language,
			hasGarnaClientID: Boolean(payload.garnaClientID),
		},
		timestamp: new Date().toISOString(),
	});

	try {
		const res = await fetch(N8N_WEBHOOK_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		if (res.ok) {
			console.log(`${LOG_PREFIX} form_completed success:`, {
				status: res.status,
				statusText: res.statusText,
				url: res.url,
			});
		} else {
			const text = await res.text();
			console.warn(`${LOG_PREFIX} form_completed failed:`, {
				status: res.status,
				statusText: res.statusText,
				url: res.url,
				bodyPreview: text.slice(0, 200),
			});
		}
	} catch (err) {
		console.warn(`${LOG_PREFIX} form_completed error:`, {
			error: err instanceof Error ? err.message : String(err),
			stack: err instanceof Error ? err.stack : undefined,
		});
	}
}
