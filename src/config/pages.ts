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
		path: 'contractor-of-record',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en', 'es', 'pt', 'ru'],
	},
	{
		path: 'mid-size-business-payroll',
		mode: 'static',
		searchable: false,
		showHeader: true,
		languages: ['en', 'es', 'pt', 'ru'],
	},
	{
		path: 'enterprise-payroll',
		mode: 'static',
		searchable: false,
		showHeader: true,
		languages: ['en', 'es', 'pt', 'ru'],
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
		path: 'white-label-payroll',
		mode: 'static',
		searchable: true,
		showHeader: true,
	},
	{
		path: 'white-label',
		mode: 'static',
		searchable: false,
		showHeader: true,
	},
	{
		path: 'small-business-payroll',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en', 'es', 'pt', 'ru'],
	},
	{
		path: 'payroll-small-business',
		mode: 'static',
		searchable: false,
		showHeader: true,
		languages: ['en', 'es', 'pt', 'ru'],
	},
	{
		path: 'payroll-solution-new',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en', 'es', 'pt', 'ru'],
	},
	{
		path: 'employer-of-record',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en', 'es', 'pt', 'ru'],
	},
	{
		path: 'blog',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en', 'es', 'pt', 'ru'],
	},
	{
		path: 'blog-author',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en', 'es', 'pt', 'ru'],
	},
	{
		path: 'blog-article',
		mode: 'static',
		searchable: true,
		showHeader: true,
		languages: ['en', 'es', 'pt', 'ru'],
	},
];
