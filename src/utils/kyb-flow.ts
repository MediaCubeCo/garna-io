export type ExperienceMode = 'customer' | 'demo';
export type YesNo = 'yes' | 'no' | null;

export type Address = {
	line1: string;
	city: string;
	postalCode: string;
	country: string;
};

export type Person = {
	id: string;
	fullName: string;
	dateOfBirth: string;
	residenceCountry: string;
	ownershipPercent?: number;
};

export type RiskAnswer = { answer: YesNo; details: string };

export type UploadedDocument = {
	id: string;
	requirementId: string;
	fileId: string;
	filename: string;
	mimeType: string;
	size: number;
	status: 'uploading' | 'uploaded' | 'failed' | 'verified' | 'rejected';
};

export type KybApplication = {
	version: number;
	status: 'draft' | 'submitted' | 'needs_information' | 'under_review' | 'approved' | 'rejected';
	countryConfigVersion: string;
	company: {
		country: string;
		entityType: string;
		legalName: string;
		registrationNumber: string;
		incorporationDate: string;
		region: string;
	};
	contact: {
		registeredAddress: Address;
		operatingSame: YesNo;
		operatingAddress: Address;
		email: string;
		phone: string;
	};
	business: {
		industry: string;
		industryOther: string;
		description: string;
		website: string;
		noWebsite: boolean;
		accountPurposes: string[];
	};
	representative: {
		fullName: string;
		dateOfBirth: string;
		placeOfBirth: string;
		citizenships: string[];
		residenceCountry: string;
		titlePosition: string;
		identity: {
			documentType: string;
			documentNumber: string;
			issueDate: string;
			expiryDate: string;
			issuingAuthority: string;
		};
		roles: string[];
		authorityBasis: string;
	};
	ownership: {
		representativeOwnershipPercent?: number;
		beneficialOwners: Person[];
		directors: Person[];
		complexStructure: YesNo;
		structureDescription: string;
	};
	activity: {
		monthlyVolumeBandId: string;
		transactionCountBandId: string;
		markets: string[];
		counterpartyCountries: string[];
		sourceOfFunds: string;
		sourceOfFundsDetails: string;
	};
	compliance: Record<'pep' | 'sanctions' | 'thirdParty' | 'offshore' | 'cash' | 'crypto', RiskAnswer>;
	documents: UploadedDocument[];
	disclosures: {
		verificationNoticeVersion: string;
		privacyNoticeVersion: string;
	};
	declaration: {
		signatureName: string;
		accepted: boolean;
		textVersion: string;
	};
	currentMicroId: MicroId;
	createdAt: string;
	updatedAt: string;
};

export type MicroId =
	| 'contact-email'
	| 'company-jurisdiction'
	| 'company-registration'
	| 'company-incorporation'
	| 'registered-address'
	| 'operating-choice'
	| 'operating-address'
	| 'business-contact'
	| 'business-profile'
	| 'business-website'
	| 'business-purpose'
	| 'representative-personal'
	| 'representative-identity'
	| 'representative-roles'
	| 'ownership-you'
	| 'ownership-owners'
	| 'ownership-directors'
	| 'ownership-structure'
	| 'activity-volume'
	| 'activity-markets'
	| 'activity-funds'
	| 'compliance-pep'
	| 'compliance-sanctions'
	| 'compliance-third-party'
	| 'compliance-offshore'
	| 'compliance-cash'
	| 'compliance-crypto'
	| 'documents'
	| 'review';

export type KybSectionId = 'company' | 'contact' | 'business' | 'representative' | 'ownership' | 'activity' | 'compliance' | 'documents' | 'review';

export type DocumentRequirement = {
	id: string;
	title: string;
	required: boolean;
	when?: 'complexStructure' | 'authorityEvidence' | 'sourceOfFundsEvidence';
};

export type KybConfig = {
	version: string;
	country: string;
	supported: boolean;
	legalEntityName: string;
	entityTypes: string[];
	industries: string[];
	accountPurposes: string[];
	markets: string[];
	sourcesOfFunds: string[];
	volumeBands: Array<{ id: string; label: string }>;
	transactionCountBands: Array<{ id: string; label: string }>;
	uboThresholdPercent: number;
	documentRequirements: DocumentRequirement[];
	upload: { acceptedMimeTypes: string[]; maxBytes: number };
	verificationNotice: {
		visibleSummary: string;
		fullText: string;
		version: string;
		privacyNoticeUrl?: string;
	};
	declarationText: string;
	declarationVersion: string;
};

const emptyAddress = (): Address => ({ line1: '', city: '', postalCode: '', country: '' });
const emptyRisk = (): RiskAnswer => ({ answer: null, details: '' });

export const defaultCanadaKybConfig: KybConfig = {
	version: 'ca-fallback-2026-08',
	country: 'Canada',
	supported: true,
	legalEntityName: 'Mediacube Pay Inc.',
	entityTypes: ['Private corporation', 'Public corporation', 'Private limited company', 'Partnership', 'Non-profit organisation', 'Other legal entity'],
	industries: ['Software and digital services', 'Media and entertainment', 'Professional services', 'E-commerce and retail', 'Manufacturing', 'Financial services', 'Other'],
	accountPurposes: ['Pay contractors', 'Pay suppliers', 'Receive customer payments', 'Hold multiple currencies', 'Manage operating expenses', 'Other'],
	markets: ['Canada', 'EEA', 'United Kingdom', 'United States', 'Latin America', 'Asia-Pacific', 'Australia', 'Other'],
	sourcesOfFunds: ['Customer revenue', 'Investment or funding', 'Shareholder contribution', 'Company assets', 'Loan proceeds', 'Other'],
	volumeBands: [
		{ id: 'under_110k_usd', label: 'Under USD 110,000' },
		{ id: '110k_to_250k_usd', label: 'USD 110,000–250,000' },
		{ id: 'over_250k_usd', label: 'Over USD 250,000' },
	],
	transactionCountBands: [
		{ id: '1_50', label: '1–50' },
		{ id: '51_100', label: '51–100' },
		{ id: '101_plus', label: '101+' },
	],
	uboThresholdPercent: 20,
	documentRequirements: [
		{ id: 'incorporation', title: 'Company registration document', required: true },
		{ id: 'representativeId', title: 'Your identity document', required: true },
		{ id: 'businessAddress', title: 'Proof of business / trading address', required: false },
		{ id: 'ownershipChart', title: 'Ownership chart', required: true, when: 'complexStructure' },
		{ id: 'authorityEvidence', title: 'Proof of authority', required: true, when: 'authorityEvidence' },
	],
	upload: { acceptedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'], maxBytes: 10 * 1024 * 1024 },
	verificationNotice: {
		visibleSummary: 'Mediacube Pay Inc. collects company, ownership, representative and identity information to verify the business and meet Canadian anti-money-laundering and terrorist-financing requirements. The information may be reviewed by authorised verification and compliance providers, and disclosed where required by law.',
		fullText: 'This questionnaire supports identity and business verification under the PCMLTFA and applicable FINTRAC requirements. It also helps us prevent financial crime and protect the integrity of our services. Please provide complete and accurate answers. If required information is missing, inaccurate or cannot be verified, Mediacube Pay Inc. may be unable to provide services or process transactions.',
		version: 'ca-verification-notice-2026-08',
		privacyNoticeUrl: 'https://app.garna.io/api/documents/privacy?lang=en',
	},
	declarationText: 'I declare that I am an authorised representative of the company and that the information provided in this questionnaire is true, accurate and complete. I undertake to promptly inform Mediacube Pay Inc. of any changes to this information. I acknowledge that this questionnaire is used to comply with Canadian anti-money-laundering and terrorist-financing requirements under the PCMLTFA and applicable FINTRAC guidance.',
	declarationVersion: 'ca-declaration-2026-08',
};

export const pendingCountryReviewConfigVersion = 'pending-local-review-2026-10';

export const countryConfigVersionFor = (country: string) => country === defaultCanadaKybConfig.country
	? defaultCanadaKybConfig.version
	: pendingCountryReviewConfigVersion;

export const getKybConfigForCountry = (country: string): KybConfig => {
	if (!country || country === defaultCanadaKybConfig.country) return defaultCanadaKybConfig;
	return {
		...defaultCanadaKybConfig,
		version: pendingCountryReviewConfigVersion,
		country,
		supported: false,
		uboThresholdPercent: 0,
		volumeBands: defaultCanadaKybConfig.volumeBands.map((band) => ({ ...band, label: `${band.label} equivalent` })),
		documentRequirements: defaultCanadaKybConfig.documentRequirements.map((requirement) => ({ ...requirement })),
	};
};

export const createEmptyKybApplication = (now = new Date().toISOString()): KybApplication => ({
	version: 1,
	status: 'draft',
	countryConfigVersion: defaultCanadaKybConfig.version,
	company: { country: '', entityType: '', legalName: '', registrationNumber: '', incorporationDate: '', region: '' },
	contact: { registeredAddress: emptyAddress(), operatingSame: null, operatingAddress: emptyAddress(), email: '', phone: '' },
	business: { industry: '', industryOther: '', description: '', website: '', noWebsite: false, accountPurposes: [] },
	representative: {
		fullName: '', dateOfBirth: '', placeOfBirth: '', citizenships: [], residenceCountry: '', titlePosition: '',
		identity: { documentType: '', documentNumber: '', issueDate: '', expiryDate: '', issuingAuthority: '' },
		roles: [], authorityBasis: '',
	},
	ownership: { beneficialOwners: [], directors: [], complexStructure: null, structureDescription: '' },
	activity: { monthlyVolumeBandId: '', transactionCountBandId: '', markets: [], counterpartyCountries: [], sourceOfFunds: '', sourceOfFundsDetails: '' },
	compliance: { pep: emptyRisk(), sanctions: emptyRisk(), thirdParty: emptyRisk(), offshore: emptyRisk(), cash: emptyRisk(), crypto: emptyRisk() },
	documents: [],
	disclosures: { verificationNoticeVersion: defaultCanadaKybConfig.verificationNotice.version, privacyNoticeVersion: 'garna-privacy-current' },
	declaration: { signatureName: '', accepted: false, textVersion: defaultCanadaKybConfig.declarationVersion },
	currentMicroId: 'contact-email',
	createdAt: now,
	updatedAt: now,
});

export const demoKybApplication = (): KybApplication => {
	const application = createEmptyKybApplication('2026-08-31T12:00:00.000Z');
	return {
		...application,
		company: { country: 'Canada', entityType: 'Private corporation', legalName: 'Northstar Audio Labs Inc.', registrationNumber: 'BC1458201', incorporationDate: '2023-02-14', region: 'British Columbia' },
		contact: {
			email: 'hello@northstaraudio.example', phone: '+1 604 555 0182', operatingSame: 'yes',
			registeredAddress: { line1: '118 Fictional Avenue', city: 'Vancouver', postalCode: 'V6B 2W9', country: 'Canada' },
			operatingAddress: emptyAddress(),
		},
		business: { industry: 'Software and digital services', industryOther: '', description: 'We build web-based audio production tools and license software to independent creators and media companies.', website: 'https://northstaraudio.example', noWebsite: false, accountPurposes: ['Pay contractors', 'Receive customer payments', 'Hold multiple currencies'] },
		representative: {
			fullName: 'Alex Morgan', dateOfBirth: '1988-06-12', placeOfBirth: 'Toronto, Canada', citizenships: ['Canada'], residenceCountry: 'Canada', titlePosition: 'Managing Director',
			identity: { documentType: 'Passport', documentNumber: 'DEMO-7281', issueDate: '2022-04-05', expiryDate: '2032-04-05', issuingAuthority: 'Demo authority' },
			roles: ['Director', 'Beneficial owner', 'Authorised signatory'], authorityBasis: '',
		},
		ownership: { representativeOwnershipPercent: 100, beneficialOwners: [], directors: [], complexStructure: 'no', structureDescription: '' },
		activity: { monthlyVolumeBandId: 'under_110k_usd', transactionCountBandId: '1_50', markets: ['EEA', 'United States', 'Canada', 'Australia'], counterpartyCountries: ['Canada', 'Germany', 'United States', 'United Kingdom', 'Australia'], sourceOfFunds: 'Customer revenue', sourceOfFundsDetails: 'Subscription fees and software licence payments from business customers.' },
		compliance: { pep: { answer: 'no', details: '' }, sanctions: { answer: 'no', details: '' }, thirdParty: { answer: 'no', details: '' }, offshore: { answer: 'no', details: '' }, cash: { answer: 'no', details: '' }, crypto: { answer: 'no', details: '' } },
		documents: [
			{ id: 'demo-inc', requirementId: 'incorporation', fileId: 'demo-inc', filename: 'northstar-certificate-demo.pdf', mimeType: 'application/pdf', size: 120000, status: 'uploaded' },
			{ id: 'demo-id', requirementId: 'representativeId', fileId: 'demo-id', filename: 'alex-passport-demo.jpg', mimeType: 'image/jpeg', size: 95000, status: 'uploaded' },
		],
		declaration: { signatureName: 'Alex Morgan', accepted: false, textVersion: defaultCanadaKybConfig.declarationVersion },
	};
};

export const KYB_SECTIONS: Array<{ id: KybSectionId; label: string; description: string; first: MicroId }> = [
	{ id: 'company', label: 'Company', description: 'Registration details', first: 'contact-email' },
	{ id: 'contact', label: 'Addresses', description: 'Where to reach you', first: 'registered-address' },
	{ id: 'business', label: 'Business activity', description: 'What your company does', first: 'business-profile' },
	{ id: 'representative', label: 'Your details', description: 'Identity and authority', first: 'representative-personal' },
	{ id: 'ownership', label: 'Ownership', description: 'Owners and directors', first: 'ownership-you' },
	{ id: 'activity', label: 'Account use', description: 'Expected payments', first: 'activity-volume' },
	{ id: 'compliance', label: 'Compliance', description: 'A few risk questions', first: 'compliance-pep' },
	{ id: 'documents', label: 'Documents', description: 'Evidence for verification', first: 'documents' },
	{ id: 'review', label: 'Review', description: 'Check and submit', first: 'review' },
];

const BASE_FLOW: MicroId[] = [
	'contact-email', 'company-jurisdiction', 'company-registration', 'company-incorporation',
	'registered-address', 'operating-choice', 'operating-address', 'business-contact',
	'business-profile', 'business-website', 'business-purpose',
	'representative-personal', 'representative-identity', 'representative-roles',
	'ownership-you', 'ownership-owners', 'ownership-directors', 'ownership-structure',
	'activity-volume', 'activity-markets', 'activity-funds',
	'compliance-pep', 'compliance-sanctions', 'compliance-third-party', 'compliance-offshore', 'compliance-cash', 'compliance-crypto',
	'documents', 'review',
];

export const getComputedKybFlow = (application: KybApplication): MicroId[] => BASE_FLOW.filter((microId) => {
	if (microId === 'operating-address') return application.contact.operatingSame === 'no';
	if (microId === 'ownership-you') return application.representative.roles.includes('Beneficial owner');
	return true;
});

export const sectionForMicroId = (microId: MicroId): KybSectionId => {
	if (microId.startsWith('company-') || microId === 'contact-email') return 'company';
	if (microId === 'registered-address' || microId.startsWith('operating-') || microId === 'business-contact') return 'contact';
	if (microId.startsWith('business-')) return 'business';
	if (microId.startsWith('representative-')) return 'representative';
	if (microId.startsWith('ownership-')) return 'ownership';
	if (microId.startsWith('activity-')) return 'activity';
	if (microId.startsWith('compliance-')) return 'compliance';
	if (microId === 'documents') return 'documents';
	return 'review';
};

const riskMicrostepKeys = {
	'compliance-pep': 'pep',
	'compliance-sanctions': 'sanctions',
	'compliance-third-party': 'thirdParty',
	'compliance-offshore': 'offshore',
	'compliance-cash': 'cash',
	'compliance-crypto': 'crypto',
} as const;

export const riskKeyForMicroId = (microId: MicroId): keyof KybApplication['compliance'] => riskMicrostepKeys[microId as keyof typeof riskMicrostepKeys] ?? 'pep';

const present = (value: unknown) => typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const isAdult = (date: string) => {
	if (!date) return false;
	const dob = new Date(`${date}T00:00:00Z`);
	if (Number.isNaN(dob.valueOf())) return false;
	const today = new Date();
	let age = today.getUTCFullYear() - dob.getUTCFullYear();
	const month = today.getUTCMonth() - dob.getUTCMonth();
	if (month < 0 || (month === 0 && today.getUTCDate() < dob.getUTCDate())) age -= 1;
	return age >= 18;
};

export type KybValidationErrors = Record<string, string>;

export const activeDocumentRequirements = (application: KybApplication, config: KybConfig): DocumentRequirement[] => config.documentRequirements.filter((requirement) => {
	if (requirement.when === 'complexStructure') return application.ownership.complexStructure === 'yes';
	if (requirement.when === 'authorityEvidence') return !application.representative.roles.includes('Director') && !application.representative.roles.includes('Beneficial owner');
	if (requirement.when === 'sourceOfFundsEvidence') return false;
	return true;
});

export const validateKybMicrostep = (application: KybApplication, microId: MicroId, config = defaultCanadaKybConfig): KybValidationErrors => {
	const errors: KybValidationErrors = {};
	const required = (path: string, value: unknown, message = 'This field is required.') => { if (!present(value)) errors[path] = message; };
	const address = (prefix: string, value: Address) => {
		required(`${prefix}.line1`, value.line1); required(`${prefix}.city`, value.city); required(`${prefix}.postalCode`, value.postalCode); required(`${prefix}.country`, value.country);
		if (/^p\.?\s*o\.?\s*box\b/i.test(value.line1.trim())) errors[`${prefix}.line1`] = 'Enter a physical street address, not only a PO box.';
	};
	switch (microId) {
		case 'contact-email': required('contact.email', application.contact.email); if (application.contact.email && !isEmail(application.contact.email)) errors['contact.email'] = 'Enter a valid work email address.'; break;
		case 'company-jurisdiction': required('company.country', application.company.country); required('company.entityType', application.company.entityType); if (application.company.country && !config.supported) errors['company.country'] = 'Business verification is not yet available for this registration country.'; break;
		case 'company-registration': required('company.legalName', application.company.legalName); required('company.registrationNumber', application.company.registrationNumber); break;
		case 'company-incorporation': required('company.incorporationDate', application.company.incorporationDate); required('company.region', application.company.region); if (application.company.incorporationDate && new Date(application.company.incorporationDate) > new Date()) errors['company.incorporationDate'] = 'The incorporation date cannot be in the future.'; break;
		case 'registered-address': address('contact.registeredAddress', application.contact.registeredAddress); break;
		case 'operating-choice': required('contact.operatingSame', application.contact.operatingSame, 'Choose Yes or No.'); break;
		case 'operating-address': address('contact.operatingAddress', application.contact.operatingAddress); break;
		case 'business-contact': required('contact.phone', application.contact.phone); if (application.contact.phone && !/^\+[\d\s().-]{7,}$/.test(application.contact.phone)) errors['contact.phone'] = 'Include a country code, for example +1 416 555 0100.'; break;
		case 'business-profile': required('business.industry', application.business.industry); required('business.description', application.business.description); if (application.business.industry === 'Other') required('business.industryOther', application.business.industryOther, 'Enter the industry name.'); break;
		case 'business-website': if (!application.business.noWebsite) { required('business.website', application.business.website, 'Enter a full URL or choose “The company has no website”.'); if (application.business.website && !/^https?:\/\//i.test(application.business.website)) errors['business.website'] = 'Start the URL with http:// or https://.'; } break;
		case 'business-purpose': if (!application.business.accountPurposes.length) errors['business.accountPurposes'] = 'Choose at least one purpose.'; break;
		case 'representative-personal': required('representative.fullName', application.representative.fullName); required('representative.dateOfBirth', application.representative.dateOfBirth); required('representative.placeOfBirth', application.representative.placeOfBirth); if (!application.representative.citizenships.length) errors['representative.citizenships'] = 'Add at least one citizenship.'; required('representative.residenceCountry', application.representative.residenceCountry); if (application.representative.dateOfBirth && !isAdult(application.representative.dateOfBirth)) errors['representative.dateOfBirth'] = 'The representative must be at least 18.'; break;
		case 'representative-identity': {
			const identity = application.representative.identity; required('representative.identity.documentType', identity.documentType); required('representative.identity.documentNumber', identity.documentNumber); required('representative.identity.issueDate', identity.issueDate); required('representative.identity.expiryDate', identity.expiryDate); required('representative.identity.issuingAuthority', identity.issuingAuthority);
			if (identity.issueDate && new Date(identity.issueDate) > new Date()) errors['representative.identity.issueDate'] = 'The issue date cannot be in the future.';
			if (identity.expiryDate && new Date(identity.expiryDate) <= new Date()) errors['representative.identity.expiryDate'] = 'Use a document that has not expired.';
			if (identity.issueDate && identity.expiryDate && identity.expiryDate <= identity.issueDate) errors['representative.identity.expiryDate'] = 'Expiry must be after the issue date.';
			break;
		}
		case 'representative-roles': required('representative.titlePosition', application.representative.titlePosition); if (!application.representative.roles.length) errors['representative.roles'] = 'Choose at least one role.'; if (!application.representative.roles.includes('Director') && !application.representative.roles.includes('Beneficial owner')) required('representative.authorityBasis', application.representative.authorityBasis, 'Explain the basis of your authority.'); break;
		case 'ownership-you': { const value = application.ownership.representativeOwnershipPercent; if (value == null || value <= 0 || value > 100) errors['ownership.representativeOwnershipPercent'] = 'Enter a percentage greater than 0 and no more than 100.'; break; }
		case 'ownership-owners': {
			if (!application.representative.roles.includes('Beneficial owner') && !application.ownership.beneficialOwners.length) errors['ownership.beneficialOwners'] = config.uboThresholdPercent > 0
				? `Add at least one person who owns or controls ${config.uboThresholdPercent}% or more.`
				: 'Add at least one owner or control person.';
			application.ownership.beneficialOwners.forEach((person, index) => { required(`ownership.beneficialOwners.${index}.fullName`, person.fullName); required(`ownership.beneficialOwners.${index}.dateOfBirth`, person.dateOfBirth); required(`ownership.beneficialOwners.${index}.residenceCountry`, person.residenceCountry); if (!isAdult(person.dateOfBirth)) errors[`ownership.beneficialOwners.${index}.dateOfBirth`] = 'The owner must be at least 18.'; if (!person.ownershipPercent || person.ownershipPercent <= 0 || person.ownershipPercent > 100) errors[`ownership.beneficialOwners.${index}.ownershipPercent`] = 'Enter a percentage between 0 and 100.'; });
			const total = (application.ownership.representativeOwnershipPercent || 0) + application.ownership.beneficialOwners.reduce((sum, person) => sum + (person.ownershipPercent || 0), 0); if (total > 100) errors['ownership.beneficialOwners'] = 'Declared ownership cannot exceed 100%.'; break;
		}
		case 'ownership-directors': if (!application.representative.roles.includes('Director') && !application.ownership.directors.length) errors['ownership.directors'] = 'Add at least one director.'; application.ownership.directors.forEach((person, index) => { required(`ownership.directors.${index}.fullName`, person.fullName); required(`ownership.directors.${index}.dateOfBirth`, person.dateOfBirth); required(`ownership.directors.${index}.residenceCountry`, person.residenceCountry); if (!isAdult(person.dateOfBirth)) errors[`ownership.directors.${index}.dateOfBirth`] = 'The director must be at least 18.'; }); break;
		case 'ownership-structure': required('ownership.complexStructure', application.ownership.complexStructure, 'Choose Yes or No.'); if (application.ownership.complexStructure === 'yes') required('ownership.structureDescription', application.ownership.structureDescription, 'Describe the ownership and control structure.'); break;
		case 'activity-volume': required('activity.monthlyVolumeBandId', application.activity.monthlyVolumeBandId); required('activity.transactionCountBandId', application.activity.transactionCountBandId); break;
		case 'activity-markets': if (!application.activity.markets.length) errors['activity.markets'] = 'Choose at least one market.'; if (!application.activity.counterpartyCountries.length) errors['activity.counterpartyCountries'] = 'Add at least one counterparty country.'; if (application.activity.counterpartyCountries.length > 5) errors['activity.counterpartyCountries'] = 'Add no more than five counterparty countries.'; break;
		case 'activity-funds': required('activity.sourceOfFunds', application.activity.sourceOfFunds); required('activity.sourceOfFundsDetails', application.activity.sourceOfFundsDetails); break;
		case 'documents': activeDocumentRequirements(application, config).filter((item) => item.required).forEach((item) => { if (!application.documents.some((document) => document.requirementId === item.id && document.status === 'uploaded')) errors[`documents.${item.id}`] = 'Add this document before continuing.'; }); break;
		case 'review': required('declaration.signatureName', application.declaration.signatureName); if (application.declaration.signatureName.trim().replace(/\s+/g, ' ').toLocaleLowerCase() !== application.representative.fullName.trim().replace(/\s+/g, ' ').toLocaleLowerCase()) errors['declaration.signatureName'] = 'The signature must match the representative’s full legal name.'; if (!application.declaration.accepted) errors['declaration.accepted'] = 'Accept the declaration before submitting.'; break;
		default: if (microId.startsWith('compliance-')) { const key = riskKeyForMicroId(microId); const answer = application.compliance[key]; required(`compliance.${key}.answer`, answer.answer, 'Choose Yes or No.'); if (answer.answer === 'yes') required(`compliance.${key}.details`, answer.details, 'Provide a short explanation.'); }
	}
	return errors;
};

export const validateEntireKybApplication = (application: KybApplication, config = defaultCanadaKybConfig) => {
	const flow = getComputedKybFlow(application);
	for (const microId of flow) {
		const errors = validateKybMicrostep(application, microId, config);
		if (Object.keys(errors).length) return { valid: false as const, microId, errors };
	}
	return { valid: true as const, microId: null, errors: {} };
};

export const legacyVolumeMap: Record<string, string> = {
	'Under CAD 150,000': 'under_110k_usd',
	'CAD 150,000–350,000': '110k_to_250k_usd',
	'Over CAD 350,000': 'over_250k_usd',
};

export const migrateKybDraft = (application: KybApplication): KybApplication => {
	const migrated = structuredClone(application);
	migrated.activity.monthlyVolumeBandId = legacyVolumeMap[migrated.activity.monthlyVolumeBandId] || migrated.activity.monthlyVolumeBandId;
	migrated.documents = [];
	return migrated;
};

export const isKybApplicationDraft = (value: unknown): value is KybApplication => {
	if (!value || typeof value !== 'object') return false;
	const draft = value as Partial<KybApplication>;
	return draft.version === 1
		&& draft.status === 'draft'
		&& typeof draft.currentMicroId === 'string'
		&& typeof draft.updatedAt === 'string'
		&& !!draft.company && typeof draft.company.country === 'string'
		&& !!draft.contact && typeof draft.contact.email === 'string'
		&& !!draft.business && Array.isArray(draft.business.accountPurposes)
		&& !!draft.representative && Array.isArray(draft.representative.roles)
		&& !!draft.ownership && Array.isArray(draft.ownership.beneficialOwners) && Array.isArray(draft.ownership.directors)
		&& !!draft.activity && Array.isArray(draft.activity.markets)
		&& !!draft.compliance && !!draft.declaration;
};

export const pdfVolumeProjection = {
	under_110k_usd: 'under_150k_cad',
	'110k_to_250k_usd': '150k_to_350k_cad',
	over_250k_usd: 'over_350k_cad',
} as const;

export const sanitizeKybForStorage = (application: KybApplication): KybApplication => ({
	...application,
	documents: [],
	updatedAt: new Date().toISOString(),
});

export const prepareKybSubmission = (application: KybApplication, config = defaultCanadaKybConfig) => {
	const clean = structuredClone(application);
	if (clean.contact.operatingSame === 'yes') clean.contact.operatingAddress = { ...clean.contact.registeredAddress };
	if (clean.contact.operatingSame !== 'no') clean.contact.operatingAddress = { ...clean.contact.registeredAddress };
	if (clean.business.industry !== 'Other') clean.business.industryOther = '';
	if (clean.business.noWebsite) clean.business.website = '';
	if (!clean.representative.roles.includes('Beneficial owner')) delete clean.ownership.representativeOwnershipPercent;
	if (clean.representative.roles.includes('Director') || clean.representative.roles.includes('Beneficial owner')) clean.representative.authorityBasis = '';
	if (clean.ownership.complexStructure !== 'yes') clean.ownership.structureDescription = '';
	for (const answer of Object.values(clean.compliance)) if (answer.answer !== 'yes') answer.details = '';
	const activeRequirementIds = new Set(activeDocumentRequirements(clean, config).map((requirement) => requirement.id));
	clean.documents = clean.documents.filter((document) => activeRequirementIds.has(document.requirementId) && document.status === 'uploaded');
	return clean;
};

export const projectKybApplicationToCorporatePdf = (application: KybApplication) => {
	const clean = prepareKybSubmission(application);
	return {
		corporateInformation: {
			legalName: clean.company.legalName,
			registrationNumber: clean.company.registrationNumber,
			incorporationDate: clean.company.incorporationDate,
			region: clean.company.region,
			country: clean.company.country,
		},
		contact: {
			registeredAddress: clean.contact.registeredAddress,
			operatingAddress: clean.contact.operatingAddress,
			email: clean.contact.email,
			phone: clean.contact.phone,
		},
		business: {
			industry: clean.business.industry === 'Other' ? clean.business.industryOther : clean.business.industry,
			description: clean.business.description,
			website: clean.business.noWebsite ? '' : clean.business.website,
			accountPurposes: clean.business.accountPurposes,
		},
		representative: clean.representative,
		ownership: clean.ownership,
		activity: { ...clean.activity, corporatePdfVolumeBand: pdfVolumeProjection[clean.activity.monthlyVolumeBandId as keyof typeof pdfVolumeProjection] || '' },
		compliance: clean.compliance,
		declaration: clean.declaration,
	};
};
