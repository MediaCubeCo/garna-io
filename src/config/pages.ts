export interface PageConfig {
	/**
	 * Base path of the page (without locale)
	 * For example: "about", "blog", "vacancies". For the main page — empty string.
	 */
	path: string;
	/**
	 * Page processing mode:
	 * - "static": Serve Astro-generated HTML assets through the Worker
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
	/**
	 * Optional list of languages this page is published in.
	 * When omitted, the page is available in every supported language.
	 */
	languages?: string[];
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
	{
		path: 'ai-hiring',
		mode: 'static',
		searchable: true,
		showHeader: true,
	},
	{
		path: 'white-label',
		mode: 'static',
		searchable: true,
		showHeader: true,
	},
	{
		path: 'payroll-small-business',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en'],
	},
	{
		path: 'employer-of-record',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en'],
	},
	{
		path: 'blog',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en'],
	},
	{
		path: 'blog-author',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en'],
	},
	{
		path: 'blog-article',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en'],
	},
];
