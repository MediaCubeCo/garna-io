import React from 'react';
import { IForm, IValidInfo } from '../components/modal/modal';
import freeEmailDomains from 'free-email-domains';

const DEFAULT_MESSAGES = {
	required: 'This field is required',
	invalidEmail: 'Please enter a valid email address',
	workEmail: 'Please use your work email (no free email providers like Gmail, Yahoo, etc.)',
};

export interface IValidationMessages {
	required?: string;
	invalidEmail?: string;
	workEmail?: string;
}

export default function formValidation(
	values: IForm,
	validInfo: IValidInfo,
	setValidInfo: React.Dispatch<React.SetStateAction<IValidInfo>>,
	messages: IValidationMessages = {}
): void {
	const msg = { ...DEFAULT_MESSAGES, ...messages };

	function checkEmpty(val: unknown): string {
		if (val === '' || val === null || val === undefined) return msg.required;
		return '';
	}

	function checkEmail(email: string): string {
		if (email.trim() === '') return msg.required;
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
			return msg.invalidEmail;
		}

		const domain = extractDomains(email);

		if (freeEmailDomains.includes(domain)) {
			return msg.workEmail;
		}
		return '';
	}

	const nextErrors = { ...validInfo.errorsMessage };

	(Object.entries(values) as [keyof IForm, IForm[keyof IForm]][]).forEach(([key, value]) => {
		nextErrors[key] = checkEmpty(value);
	});

	nextErrors.email = checkEmail(values.email);

	const isFormValid = Object.values(nextErrors).every((m) => m === '');

	setValidInfo({
		...validInfo,
		isFormValid,
		errorsMessage: nextErrors,
	});
}

function extractDomains(email: string): string {
	return email.trim().toLocaleLowerCase().split('@').pop() ?? '';
}
