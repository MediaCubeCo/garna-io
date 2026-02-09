import type { IForm } from '../components/modal/modal';

const N8N_WEBHOOK_URL = 'https://mediacube.app.n8n.cloud/webhook/24740331-652c-4731-a656-baf8d8f5cf38';

export interface IWebhookPayload {
	firstName: string;
	lastName: string;
	email: string;
	numEmployes: string;
	emailHash?: string;
}

/**
 * Sends form data to the n8n webhook when the user completes step 1 and moves to step 2.
 * Fires once per transition; does not throw (failures are logged only).
 */
export type IFormWithHash = IForm & { emailHash?: string };

const LOG_PREFIX = '[garna widget] webhook';

export async function sendFormCompletedWebhook(form: IFormWithHash): Promise<void> {
	const payload: IWebhookPayload = {
		firstName: form.firstName,
		lastName: form.lastName,
		email: form.email,
		numEmployes: form.numEmployes,
		...(form.emailHash != null && form.emailHash !== '' ? { emailHash: form.emailHash } : {}),
	};

	console.log(`${LOG_PREFIX} sending form_completed:`, {
		url: N8N_WEBHOOK_URL,
		payload: {
			firstName: payload.firstName,
			lastName: payload.lastName,
			email: payload.email,
			numEmployes: payload.numEmployes,
			hasEmailHash: Boolean(payload.emailHash),
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
