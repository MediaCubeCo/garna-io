import {
	isKybApplicationDraft,
	migrateKybDraft,
	sanitizeKybForStorage,
	type KybApplication,
	type KybConfig,
} from './kyb-flow';

export interface KybConfigAdapter {
	load(country: string): Promise<KybConfig>;
}

export interface KybDraftAdapter {
	load(): Promise<KybApplication | null>;
	save(application: KybApplication): Promise<void>;
	discard(): Promise<void>;
}

export interface KybSubmitResult {
	applicationId: string;
	reference: string;
	status: 'submitted' | 'needs_information' | 'under_review';
}

export interface KybSubmitAdapter {
	submit(application: KybApplication, idempotencyKey: string): Promise<KybSubmitResult>;
}

export interface KybUploadResult {
	fileId: string;
	checksum?: string;
}

export interface KybUploadAdapter {
	upload(requirementId: string, file: File): Promise<KybUploadResult>;
}

const isKybConfig = (value: unknown): value is KybConfig => {
	if (!value || typeof value !== 'object') return false;
	const config = value as Partial<KybConfig>;
	return typeof config.country === 'string'
		&& typeof config.version === 'string'
		&& typeof config.supported === 'boolean'
		&& Array.isArray(config.entityTypes)
		&& Array.isArray(config.volumeBands)
		&& Array.isArray(config.documentRequirements)
		&& Boolean(config.verificationNotice?.version)
		&& Boolean(config.declarationVersion);
};

export const createLocalKybConfigAdapter = (resolve: (country: string) => KybConfig): KybConfigAdapter => ({
	async load(country) { return resolve(country); },
});

export const createRemoteKybConfigAdapter = (fallback: (country: string) => KybConfig, fetcher: typeof fetch = fetch): KybConfigAdapter => ({
	async load(country) {
		const response = await fetcher(`/api/kyb/config?country=${encodeURIComponent(country)}`, { credentials: 'same-origin', cache: 'no-store', headers: { accept: 'application/json' } });
		if (response.status === 404) return fallback(country);
		if (!response.ok) throw new Error('Country configuration could not be loaded');
		const result = await response.json() as { config?: unknown };
		if (!isKybConfig(result.config)) throw new Error('Country configuration response is invalid');
		return result.config;
	},
});

export const createLocalKybDraftAdapter = (storage: Storage, key: string, ttlMs: number): KybDraftAdapter => ({
	async load() {
		try {
			const raw = storage.getItem(key);
			if (!raw) return null;
			const parsed: unknown = JSON.parse(raw);
			if (!isKybApplicationDraft(parsed) || Date.now() - new Date(parsed.updatedAt).valueOf() > ttlMs) {
				storage.removeItem(key);
				return null;
			}
			return migrateKybDraft(parsed);
		} catch {
			storage.removeItem(key);
			return null;
		}
	},
	async save(application) {
		storage.setItem(key, JSON.stringify(sanitizeKybForStorage(application)));
	},
	async discard() {
		storage.removeItem(key);
	},
});

export const createRemoteKybDraftAdapter = (fetcher: typeof fetch = fetch): KybDraftAdapter => ({
	async load() {
		const response = await fetcher('/api/kyb/drafts/current', { credentials: 'same-origin', cache: 'no-store', headers: { accept: 'application/json' } });
		if (response.status === 404) return null;
		if (!response.ok) throw new Error('Draft could not be loaded');
		const result = await response.json() as { application?: unknown };
		if (!isKybApplicationDraft(result.application)) throw new Error('Draft response is invalid');
		return migrateKybDraft(result.application);
	},
	async save(application) {
		const response = await fetcher('/api/kyb/drafts/current', {
			method: 'PUT',
			credentials: 'same-origin',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ application: sanitizeKybForStorage(application), clientSchemaVersion: 1 }),
		});
		if (!response.ok) throw new Error('Draft could not be saved');
	},
	async discard() {
		const response = await fetcher('/api/kyb/drafts/current', { method: 'DELETE', credentials: 'same-origin' });
		if (!response.ok && response.status !== 404) throw new Error('Draft could not be deleted');
	},
});

export const createRemoteKybSubmitAdapter = (fetcher: typeof fetch = fetch): KybSubmitAdapter => ({
	async submit(application, idempotencyKey) {
		const response = await fetcher('/api/kyb/applications', {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'content-type': 'application/json', 'idempotency-key': idempotencyKey },
			body: JSON.stringify({ application, clientSchemaVersion: 1 }),
		});
		if (!response.ok) throw new Error('Submission failed');
		const result = await response.json() as Partial<KybSubmitResult>;
		if (!result.applicationId || !result.reference || !result.status) throw new Error('Submission response is invalid');
		return result as KybSubmitResult;
	},
});

export const createRemoteKybUploadAdapter = (fetcher: typeof fetch = fetch): KybUploadAdapter => ({
	async upload(requirementId, file) {
		const response = await fetcher('/api/kyb/uploads', {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'content-type': file.type, 'x-kyb-requirement-id': requirementId, 'x-file-name': encodeURIComponent(file.name) },
			body: file,
		});
		if (!response.ok) throw new Error('Upload failed');
		const result = await response.json() as Partial<KybUploadResult>;
		if (!result.fileId) throw new Error('Upload response is invalid');
		return result as KybUploadResult;
	},
});
