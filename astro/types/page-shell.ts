export interface PageShellConfig {
	title: string;
	description?: string;
	keywords?: string;
	ogImage?: string;
	htmlClass?: string;
	bodyClass?: string;
	iconLibrary?: 'iconify' | 'lucide';
	headExtra?: string;
}
