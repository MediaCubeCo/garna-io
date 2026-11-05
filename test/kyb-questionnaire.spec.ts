import { describe, expect, it } from 'vitest';
import { handleKybQuestionnaire, type KybQuestionnaireEnv } from '../src/routes/kyb-questionnaire';
import { demoKybApplication, validateEntireKybApplication } from '../src/utils/kyb-flow';
import { formatKybQuestionnaireEmail, kybNotifyRecipients } from '../src/utils/kyb-notification';

const completedApplication = () => {
	const application = demoKybApplication();
	application.declaration.accepted = true;
	return application;
};

describe('Business Account questionnaire email', () => {
	it('addresses the two Garna recipients by default', () => {
		expect(kybNotifyRecipients()).toEqual(['vlk@mediacube.io', 'mikiv@mediacube.io']);
		expect(kybNotifyRecipients('other@example.com')).toEqual(['other@example.com']);
	});

	it('includes the completed answers in the email', () => {
		const application = completedApplication();
		expect(validateEntireKybApplication(application).valid).toBe(true);
		const message = formatKybQuestionnaireEmail(application, { locale: 'en', page: '/en/business-account', submittedAt: '2026-10-08T12:00:00.000Z' });
		expect(message.subject).toContain('Northstar Audio Labs Inc.');
		expect(message.text).toContain('hello@northstaraudio.example');
		expect(message.text).toContain('DEMO-7281');
		expect(message.text).toContain('Political exposure: no');
		expect(message.html).toContain('Northstar Audio Labs Inc.');
		expect(message.html).not.toContain('<script>');
		expect(message.replyTo?.email).toBe('hello@northstaraudio.example');
	});

	it('sends a valid questionnaire through Cloudflare Email Sending', async () => {
		const sent: Array<{ to: string | string[]; subject: string }> = [];
		const env: KybQuestionnaireEnv = {
			EMAIL_FROM: 'noreply@garna.io',
			KYB_NOTIFY_EMAILS: 'vlk@mediacube.io,mikiv@mediacube.io',
			EMAIL: {
				send: async (message) => {
					sent.push(message);
					return { messageId: 'test' };
				},
			},
		};
		const request = new Request('https://garna.io/api/business-account/questionnaire', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': '203.0.113.10' },
			body: JSON.stringify({ application: completedApplication(), locale: 'ru', page: '/ru/business-account' }),
		});
		const response = await handleKybQuestionnaire(request, env);
		expect(response?.status).toBe(200);
		expect(sent).toHaveLength(1);
		expect(sent[0].to).toEqual(['vlk@mediacube.io', 'mikiv@mediacube.io']);
		expect(sent[0].subject).toContain('Northstar Audio Labs Inc.');
	});

	it('does not send an incomplete questionnaire', async () => {
		let sent = false;
		const env: KybQuestionnaireEnv = {
			EMAIL: { send: async () => { sent = true; return { messageId: 'test' }; } },
		};
		const request = new Request('https://garna.io/api/business-account/questionnaire', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': '203.0.113.11' },
			body: JSON.stringify({ application: demoKybApplication() }),
		});
		const response = await handleKybQuestionnaire(request, env);
		expect(response?.status).toBe(400);
		expect(sent).toBe(false);
	});
});
