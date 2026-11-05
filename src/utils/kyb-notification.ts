import { getKybConfigForCountry, prepareKybSubmission, type KybApplication, type Person } from './kyb-flow';

const DEFAULT_NOTIFY_EMAILS = ['vlk@mediacube.io', 'mikiv@mediacube.io'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const riskLabels: Record<keyof KybApplication['compliance'], string> = {
	pep: 'Political exposure',
	sanctions: 'Sanctions and restrictions',
	thirdParty: 'Acting for others',
	offshore: 'Offshore accounts',
	cash: 'Physical cash',
	crypto: 'Crypto activity',
};

export const kybNotifyRecipients = (raw?: string): string[] => {
	const parsed = (raw || '')
		.split(',')
		.map((value) => value.trim().toLowerCase())
		.filter((value) => emailPattern.test(value));
	return parsed.length ? [...new Set(parsed)] : [...DEFAULT_NOTIFY_EMAILS];
};

const escapeHtml = (value: string) =>
	value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] || character);

const blank = (value: string) => value.trim() || '—';

const formatAddress = (address: KybApplication['contact']['registeredAddress']) =>
	[address.line1, address.city, address.postalCode, address.country].map((part) => part.trim()).filter(Boolean).join(', ') || '—';

const formatPerson = (person: Person) => {
	const ownership = person.ownershipPercent == null ? '' : ` (${person.ownershipPercent}%)`;
	return `${person.fullName}${ownership} — ${person.dateOfBirth}, ${person.residenceCountry}`;
};

export const formatKybQuestionnaireEmail = (
	application: KybApplication,
	meta: { locale?: string; page?: string; submittedAt: string },
) => {
	const clean = prepareKybSubmission(application);
	const config = getKybConfigForCountry(clean.company.country);
	const volume = config.volumeBands.find((band) => band.id === clean.activity.monthlyVolumeBandId)?.label || clean.activity.monthlyVolumeBandId;
	const transactions = config.transactionCountBands.find((band) => band.id === clean.activity.transactionCountBandId)?.label || clean.activity.transactionCountBandId;
	const industry = clean.business.industry === 'Other' ? clean.business.industryOther : clean.business.industry;
	const owners = [
		clean.representative.roles.includes('Beneficial owner') && clean.ownership.representativeOwnershipPercent != null
			? `${clean.representative.fullName} (${clean.ownership.representativeOwnershipPercent}%) — representative`
			: '',
		...clean.ownership.beneficialOwners.map(formatPerson),
	].filter(Boolean);
	const directors = [
		clean.representative.roles.includes('Director') ? `${clean.representative.fullName} — representative` : '',
		...clean.ownership.directors.map(formatPerson),
	].filter(Boolean);
	const lines: Array<[string, string]> = [
		['Submitted', meta.submittedAt],
		['Page', meta.page || '—'],
		['Language', meta.locale || '—'],
		['Work email', clean.contact.email],
		['Phone', clean.contact.phone],
		['Legal name', clean.company.legalName],
		['Entity type', clean.company.entityType],
		['Registration country', clean.company.country],
		['Registration number', clean.company.registrationNumber],
		['Incorporation date', clean.company.incorporationDate],
		['Region', blank(clean.company.region)],
		['Registered office', formatAddress(clean.contact.registeredAddress)],
		['Operating office', clean.contact.operatingSame === 'yes' ? 'Same as registered office' : formatAddress(clean.contact.operatingAddress)],
		['Industry', industry],
		['Business description', clean.business.description],
		['Website', clean.business.noWebsite ? 'No website' : blank(clean.business.website)],
		['Account purposes', clean.business.accountPurposes.join(', ') || '—'],
		['Representative', clean.representative.fullName],
		['Date of birth', clean.representative.dateOfBirth],
		['Place of birth', clean.representative.placeOfBirth],
		['Citizenships', clean.representative.citizenships.join(', ') || '—'],
		['Residence', clean.representative.residenceCountry],
		['Title', clean.representative.titlePosition],
		['Roles', clean.representative.roles.join(', ') || '—'],
		['Basis of authority', blank(clean.representative.authorityBasis)],
		['Identity document', `${clean.representative.identity.documentType} ${clean.representative.identity.documentNumber}`.trim()],
		['Document issued', `${clean.representative.identity.issueDate} by ${clean.representative.identity.issuingAuthority}`],
		['Document expires', clean.representative.identity.expiryDate],
		['Beneficial owners', owners.join('; ') || '—'],
		['Directors', directors.join('; ') || '—'],
		['Complex structure', clean.ownership.complexStructure || '—'],
		['Structure description', blank(clean.ownership.structureDescription)],
		['Monthly volume', volume || '—'],
		['Transactions per month', transactions || '—'],
		['Markets', clean.activity.markets.join(', ') || '—'],
		['Counterparty countries', clean.activity.counterpartyCountries.join(', ') || '—'],
		['Source of funds', clean.activity.sourceOfFunds],
		['Source of funds details', clean.activity.sourceOfFundsDetails],
		...Object.entries(clean.compliance).map(([key, value]) => [riskLabels[key as keyof typeof riskLabels], `${value.answer || '—'}${value.details ? ` — ${value.details}` : ''}`] as [string, string]),
		['Declaration accepted', clean.declaration.accepted ? 'Yes' : 'No'],
	];
	const subjectName = clean.company.legalName.replace(/[\r\n]+/g, ' ').trim() || 'Untitled company';
	const replyName = clean.representative.fullName.replace(/[\r\n]+/g, ' ').trim();
	const replyEmail = clean.contact.email.trim();
	return {
		subject: `Business Account questionnaire — ${subjectName}`,
		text: lines.map(([label, value]) => `${label}: ${value}`).join('\n'),
		html: `<h1>Business Account questionnaire</h1><table>${lines.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join('')}</table>`,
		replyTo: emailPattern.test(replyEmail) ? { email: replyEmail, ...(replyName ? { name: replyName } : {}) } : undefined,
	};
};
