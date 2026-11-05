import {
	isKybApplicationDraft,
	migrateKybDraft,
	sanitizeKybForStorage,
	type KybApplication,
} from './kyb-flow';

export interface KybDraftAdapter {
	load(): Promise<KybApplication | null>;
	save(application: KybApplication): Promise<void>;
	discard(): Promise<void>;
}

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
