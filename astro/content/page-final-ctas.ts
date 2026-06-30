import type { FinalCTASectionConfig } from '../types/final-cta-section';

export const pageFinalCtas = {
	home: {
		title: [{ text: 'Ready to get started?', translateKey: 'whyGarna.cta.title' }],
		description: {
			text: 'Join thousands of businesses streamlining their global payroll today',
			translateKey: 'whyGarna.cta.description',
		},
		button: {
			label: 'Book a demo',
			translateKey: 'whyGarna.cta.button',
			kind: 'demo',
			trackingCta: 'final_demo',
		},
	},
	enterprisePayroll: {
		title: [{ text: 'Global Payroll Is Easy When Made By Using Garna' }],
		description: {
			text: "Garna provides the global payroll infrastructure independently from the task — whether you're scaling into new markets, dealing with distributed teams, or replacing old, fragmented payroll systems, it’ll adjust to your needs seamlessly",
		},
		button: {
			label: 'Try now',
			kind: 'demo',
			trackingCta: 'enterprise_payroll_final_demo',
		},
	},
	midSize: {
		title: [
			{ text: 'Get Started With', translateKey: 'midSizeFinalCta.titleLine1' },
			{ text: 'Garna Payroll Today', translateKey: 'midSizeFinalCta.titleLine2' },
		],
		description: {
			text: "Whether you're dealing with remote teams, contractors in far-off countries, or just expanding in general, Garna has the flexible infrastructure to grow with you",
			translateKey: 'midSizeFinalCta.description',
		},
		button: {
			label: 'Try now',
			translateKey: 'midSizeFinalCta.button',
			kind: 'demo',
			trackingCta: 'mid_size_final_demo',
		},
	},
	offer: {
		title: [{ text: 'Ready to get paid?', translateKey: 'finalCta.title' }],
		description: {
			text: 'Join thousands of contractors who trust Garna for fast, secure, and transparent global payments',
			translateKey: 'finalCta.description',
		},
		button: {
			label: 'Start getting paid with Garna',
			translateKey: 'finalCta.button',
			kind: 'signup',
		},
	},
	aiHiring: {
		layout: 'split',
		visual: 'ai-hiring',
		title: [
			{ text: 'Stop searching.', translateKey: 'finalCta.stopSearching' },
			{
				text: 'Start hiring.',
				translateKey: 'finalCta.startHiring',
				class: 'garna-hero-title-gradient',
			},
		],
		description: {
			text: 'Skip the sourcing phase entirely. Connect instantly with pre-vetted professionals who are perfectly matched to your open roles',
			translateKey: 'finalCta.description',
		},
		button: {
			label: 'Start hiring now',
			translateKey: 'finalCta.startHiringNow',
			href: 'https://horyx.com',
			kind: 'external',
		},
	},
	whiteLabel: {
		layout: 'split',
		visual: 'white-label',
		title: [{ text: 'Become a Market Leader with Garna White Label Solution', translateKey: 'finalCta.title' }],
		description: {
			text: 'Launch a global contractor management service under your own brand today',
			translateKey: 'finalCta.description',
		},
		button: {
			label: 'Request Demo Version',
			translateKey: 'finalCta.button',
			kind: 'demo',
			trackingCta: 'final_demo',
		},
	},
	payrollSmallBusiness: {
		title: [{ text: 'Get Started With Garna Payroll Today', translateKey: 'finalCta.title' }],
		description: {
			text: 'Optimize your payroll and focus on business growth today. Join thousands of popular companies that have already automated their global payouts',
			translateKey: 'finalCta.description',
		},
		button: {
			label: 'Sign up for a free demo',
			translateKey: 'finalCta.button',
			href: 'https://app.garna.io/en/auth/sign-up',
			kind: 'signup',
			effect: 'rotating-flare',
		},
		class: 'relative overflow-hidden py-20 text-center lg:py-28',
		titleClass: 'garna-hero-title-gradient text-4xl font-normal leading-tight text-white md:text-6xl font-manrope mb-8',
		descriptionClass: 'mx-auto mt-6 max-w-2xl text-xl font-light leading-8 text-gray-400 font-manrope mb-12',
	},
	payrollSolutionNew: {
		title: [{ text: 'Launch Global Payroll Software on Autopilot Today', translateKey: 'finalCta.title' }],
		description: {
			text: 'Pay your team in 150+ countries with just a few clicks. No red tape, just fast payments',
			translateKey: 'finalCta.description',
		},
		button: {
			label: 'Book a demo',
			translateKey: 'finalCta.button',
			kind: 'demo',
			trackingCta: 'payroll_solution_new_final_demo',
		},
		class: 'overflow-hidden lg:pt-40 lg:pb-40 text-center pt-32 pb-32 relative',
		containerClass: 'z-10 max-w-4xl mr-auto ml-auto pr-6 pl-6 relative',
		titleClass:
			'garna-hero-title-gradient md:text-7xl lg:text-6xl text-5xl font-normal text-white tracking-tight font-manrope mb-8',
		descriptionClass:
			'md:text-xl lg:text-2xl text-lg font-light text-gray-400 font-manrope max-w-2xl mr-auto mb-12 ml-auto',
	},
	eor: {
		title: [{ text: 'Global Employer of Record is A Modern Hiring Process Done Stress-Free', translateKey: 'finalCta.title' }],
		description: {
			text: 'Garna offers exceptional 24/7 expert support and all the necessary features that let you have employee experiences all over the world with no arising crises and unexpected issues on your way',
			translateKey: 'finalCta.description',
		},
		button: {
			label: 'Start Going Global',
			translateKey: 'finalCta.button',
			kind: 'demo',
			trackingCta: 'eor_final_cta',
		},
		titleClass: 'mb-8 font-manrope text-4xl font-normal leading-tight tracking-tight text-white md:text-[52px]',
		descriptionClass: 'mx-auto mb-12 max-w-2xl text-lg font-light leading-relaxed text-gray-400 md:text-xl',
	},
} satisfies Record<string, FinalCTASectionConfig>;
