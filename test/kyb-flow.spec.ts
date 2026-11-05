import { describe, expect, it } from 'vitest';
import {
	createEmptyKybApplication,
	countryConfigVersionFor,
	defaultCanadaKybConfig,
	demoKybApplication,
	getKybConfigForCountry,
	getComputedKybFlow,
	isKybApplicationDraft,
	legacyVolumeMap,
	migrateKybDraft,
	pdfVolumeProjection,
	prepareKybSubmission,
	projectKybApplicationToCorporatePdf,
	sanitizeKybForStorage,
	validateKybMicrostep,
} from '../src/utils/kyb-flow';
import { kybSectionTranslations, resolveKybLocale, translateKyb } from '../src/i18n/translations/business-account/kyb';

describe('Business Account KYB flow', () => {
	it('starts with contact email and changes when the operating address differs', () => {
		const application = createEmptyKybApplication();
		expect(getComputedKybFlow(application)[0]).toBe('contact-email');
		expect(getComputedKybFlow(application)).not.toContain('operating-address');
		application.contact.operatingSame = 'no';
		expect(getComputedKybFlow(application)).toContain('operating-address');
	});

	it('shows representative ownership only for a beneficial owner', () => {
		const application = createEmptyKybApplication();
		expect(getComputedKybFlow(application)).not.toContain('ownership-you');
		application.representative.roles = ['Beneficial owner'];
		expect(getComputedKybFlow(application)).toContain('ownership-you');
	});

	it('requires an authority basis for every representative who is not a director', () => {
		const application = createEmptyKybApplication();
		application.representative.titlePosition = 'Owner';
		application.representative.roles = ['Beneficial owner'];
		expect(validateKybMicrostep(application, 'representative-roles')).toHaveProperty('representative.authorityBasis');
		application.representative.authorityBasis = 'Power of attorney';
		expect(validateKybMicrostep(application, 'representative-roles')).toEqual({});
		application.representative.roles = ['Director'];
		application.representative.authorityBasis = '';
		expect(validateKybMicrostep(application, 'representative-roles')).toEqual({});
	});

	it('requires added owners to meet the configured ownership threshold', () => {
		const application = createEmptyKybApplication();
		application.representative.roles = ['Director'];
		application.ownership.beneficialOwners = [{ id: 'owner', fullName: 'Taylor Example', dateOfBirth: '1990-01-01', residenceCountry: 'Canada', ownershipPercent: 10 }];
		expect(validateKybMicrostep(application, 'ownership-owners')).toHaveProperty('ownership.beneficialOwners.0.ownershipPercent');
		application.ownership.beneficialOwners[0].ownershipPercent = 20;
		expect(validateKybMicrostep(application, 'ownership-owners')).toEqual({});
	});

	it('requires the representative beneficial owner to meet the same ownership threshold', () => {
		const application = createEmptyKybApplication();
		application.representative.roles = ['Beneficial owner'];
		application.ownership.representativeOwnershipPercent = 10;
		expect(validateKybMicrostep(application, 'ownership-you')).toHaveProperty('ownership.representativeOwnershipPercent');
		application.ownership.representativeOwnershipPercent = 20;
		expect(validateKybMicrostep(application, 'ownership-you')).toEqual({});
	});

	it('keeps document upload out of the questionnaire flow', () => {
		expect(getComputedKybFlow(createEmptyKybApplication())).not.toContain('documents');
	});

	it('validates the email-first screen', () => {
		const application = createEmptyKybApplication();
		expect(validateKybMicrostep(application, 'contact-email')).toHaveProperty('contact.email');
		application.contact.email = 'not-an-email';
		expect(validateKybMicrostep(application, 'contact-email')['contact.email']).toContain('valid');
		application.contact.email = 'finance@example.com';
		expect(validateKybMicrostep(application, 'contact-email')).toEqual({});
	});

	it('allows countries without a registration region', () => {
		const application = createEmptyKybApplication();
		application.company.incorporationDate = '2020-01-15';
		application.company.region = '';
		expect(validateKybMicrostep(application, 'company-incorporation')).toEqual({});
	});

	it('uses the Canadian defaults for every registration country', () => {
		const application = createEmptyKybApplication();
		application.company.country = 'Poland';
		application.company.entityType = 'Private limited company';
		const config = getKybConfigForCountry('Poland');
		expect(config.supported).toBe(true);
		expect(config.uboThresholdPercent).toBe(defaultCanadaKybConfig.uboThresholdPercent);
		expect(config.volumeBands).toEqual(defaultCanadaKybConfig.volumeBands);
		expect(validateKybMicrostep(application, 'company-jurisdiction', config)).toEqual({});
		expect(countryConfigVersionFor('Poland')).toBe(defaultCanadaKybConfig.version);
		expect(countryConfigVersionFor('Canada')).toBe(defaultCanadaKybConfig.version);
	});

	it('requires confirmation but no typed signature on review', () => {
		const application = createEmptyKybApplication();
		expect(validateKybMicrostep(application, 'review')).toHaveProperty('declaration.accepted');
		application.declaration.accepted = true;
		expect(validateKybMicrostep(application, 'review')).toEqual({});
	});

	it('migrates legacy CAD draft values and rejects malformed drafts', () => {
		const application = demoKybApplication();
		application.activity.monthlyVolumeBandId = 'Under CAD 150,000';
		application.status = 'draft';
		expect(migrateKybDraft(application).activity.monthlyVolumeBandId).toBe('under_110k_usd');
		expect(isKybApplicationDraft(application)).toBe(true);
		expect(isKybApplicationDraft({ version: 1, status: 'draft' })).toBe(false);
	});

	it('projects customer-entered data to the corporate PDF field model', () => {
		const application = demoKybApplication();
		const projection = projectKybApplicationToCorporatePdf(application);
		expect(projection.corporateInformation.legalName).toBe(application.company.legalName);
		expect(projection.contact.email).toBe(application.contact.email);
		expect(projection.representative.residenceCountry).toBe('Canada');
		expect(projection.activity.corporatePdfVolumeBand).toBe('under_150k_cad');
	});

	it('requires details for every positive compliance answer', () => {
		const application = demoKybApplication();
		application.compliance.cash = { answer: 'yes', details: '' };
		expect(validateKybMicrostep(application, 'compliance-cash')).toHaveProperty('compliance.cash.details');
		application.compliance.cash.details = 'Retail tills at two stores.';
		expect(validateKybMicrostep(application, 'compliance-cash')).toEqual({});
	});

	it('blocks ownership totals above 100 percent', () => {
		const application = demoKybApplication();
		application.ownership.beneficialOwners.push({ id: 'other', fullName: 'Taylor Example', dateOfBirth: '1990-01-01', residenceCountry: 'Canada', ownershipPercent: 10 });
		expect(validateKybMicrostep(application, 'ownership-owners')).toHaveProperty('ownership.beneficialOwners');
	});

	it('keeps the approved fixed volume mappings', () => {
		expect(legacyVolumeMap['Under CAD 150,000']).toBe('under_110k_usd');
		expect(pdfVolumeProjection['110k_to_250k_usd']).toBe('150k_to_350k_cad');
		expect(defaultCanadaKybConfig.volumeBands.map((band) => band.label)).toEqual([
			'Under USD 110,000',
			'USD 110,000–250,000',
			'Over USD 250,000',
		]);
	});

	it('removes file metadata from the local draft', () => {
		const application = demoKybApplication();
		expect(application.documents.length).toBeGreaterThan(0);
		expect(sanitizeKybForStorage(application).documents).toEqual([]);
	});

	it('removes hidden conditional values from submission', () => {
		const application = demoKybApplication();
		application.business.industry = 'Professional services';
		application.business.industryOther = 'Old hidden value';
		application.compliance.cash = { answer: 'no', details: 'Old hidden details' };
		application.contact.operatingSame = 'yes';
		const payload = prepareKybSubmission(application);
		expect(payload.business.industryOther).toBe('');
		expect(payload.compliance.cash.details).toBe('');
		expect(payload.contact.operatingAddress).toEqual(payload.contact.registeredAddress);
	});

	it('provides the KYB section in all four site languages', () => {
		expect(Object.keys(kybSectionTranslations).sort()).toEqual(['en', 'es', 'pt', 'ru']);
		expect(kybSectionTranslations.ru.title).toContain('компании');
		expect(kybSectionTranslations.es.title).toContain('empresa');
		expect(kybSectionTranslations.pt.title).toContain('empresa');
	});

	it('resolves localized dynamic KYB copy without changing canonical values', () => {
		expect(resolveKybLocale('/ru/business-account')).toBe('ru');
		expect(resolveKybLocale('/en/business-account')).toBe('en');
		expect(translateKyb('ru', 'Registration country')).toBe('Страна регистрации');
		expect(translateKyb('es', 'Canada')).toBe('Canadá');
		expect(translateKyb('pt', 'Private corporation')).toBe('Corporação privada');
		expect(translateKyb('ru', 'Ready to complete the company questionnaire')).toContain('анкету');
		expect(translateKyb('ru', 'Discard saved draft and start over')).toBe('Удалить сохраненный черновик и начать заново');
		expect(translateKyb('ru', 'Ready to verify your business')).toBe('Все готово для верификации бизнеса');
		expect(translateKyb('es', 'Discard saved draft and start over')).toBe('Eliminar el borrador guardado y empezar de nuevo');
		expect(translateKyb('ru', 'Enter the work email of the company contact.')).toBe('Укажите рабочий email контактного лица компании.');
		expect(translateKyb('ru', 'EEA')).toBe('Европейская экономическая зона (ЕЭЗ)');
		expect(translateKyb('ru', 'Add at least one person who owns or controls 20% or more.')).toContain('20%');
		expect(translateKyb('ru', 'Expected monthly account turnover')).toBe('Ожидаемый оборот по счету в месяц');
		expect(translateKyb('ru', 'Under USD 110,000')).toBe('До 110 000 USD');
		expect(translateKyb('es', 'Over USD 250,000')).toBe('Más de 250.000 USD');
		expect(translateKyb('pt', 'yes')).toBe('Sim');
		expect(translateKyb('ru', 'Representative details are included automatically in the owner list')).toContain('Данные представителя');
		expect(translateKyb('ru', 'Include the country code.')).toBe('Укажите код страны.');
		expect(translateKyb('ru', 'ca-fallback-2026-08')).toBe('ca-fallback-2026-08');
	});
});
