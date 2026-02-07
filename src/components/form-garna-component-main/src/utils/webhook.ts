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

export async function sendFormCompletedWebhook(form: IFormWithHash): Promise<void> {
	const payload: IWebhookPayload = {
		firstName: form.firstName,
		lastName: form.lastName,
		email: form.email,
		numEmployes: form.numEmployes,
		...(form.emailHash != null && form.emailHash !== '' ? { emailHash: form.emailHash } : {}),
	};

	try {
		const res = await fetch(N8N_WEBHOOK_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		if (!res.ok) {
			console.warn('[garna widget] Webhook POST failed:', res.status, res.statusText);
		}
	} catch (err) {
		console.warn('[garna widget] Webhook POST error:', err);
	}
}
