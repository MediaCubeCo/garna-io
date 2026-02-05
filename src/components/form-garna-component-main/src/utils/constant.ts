export const BREAKPOINTS = {
	desktop: 1920,
	tablet: 1000,
	mobile: 768,
} as const;

export const COMPANY_SIZE_OPTIONS = [
	'1-20 people',
	'21-200 people',
	'201-1000 people',
	'1001-2000 people',
	'2001+ people',
] as const;

export type CompanySizeOption = (typeof COMPANY_SIZE_OPTIONS)[number];
