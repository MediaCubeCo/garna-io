export interface PageConfig {
	/**
	 * Base path of the page (without locale)
	 * For example: "about", "blog", "vacancies". For the main page — empty string.
	 */
	path: string;
	/**
	 * Page processing mode:
	 * - "static": Serve static HTML files from public/pages
	 */
	mode: 'static';
	/**
	 * Whether the page is indexable by search engines
	 */
	searchable?: boolean;
	/**
	 * Whether to inject the shared header component (navbar) into this page
	 */
	showHeader?: boolean;
}

export const basePaths: PageConfig[] = [
	{
		path: '',
		mode: 'static',
		searchable: true,
		showHeader: true,
	},
	{
		path: 'for-contractors',
		mode: 'static',
		searchable: true,
		showHeader: true,
	},
	{
		path: 'form',
		mode: 'static',
		searchable: false,
		showHeader: false,
	},
];
