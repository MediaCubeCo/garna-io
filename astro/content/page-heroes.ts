import type { HeroSectionConfig } from '../types/hero-section';

export const pageHeroes = {
	home: {
		class: 'overflow-hidden md:pb-32 lg:pt-48 lg:pb-32 pt-32 pb-32 relative',
		containerClass:
			'garna-container overflow-visible z-10 text-center relative',
		titleClass:
			'garna-hero-title-gradient leading-[1.1] lg:text-8xl lg:mb-12 md:mb-8 md:text-7xl text-6xl font-normal tracking-tight font-manrope mb-8',
		descriptionClass:
			'leading-relaxed lg:text-2xl md:text-xl lg:mb-16 text-lg font-light text-gray-400 font-manrope max-w-3xl mr-auto mb-12 ml-auto',
		title: [
			{ text: 'Global Payroll Solutions', translateKey: 'hero.title' },
			{
				text: 'for your business',
				translateKey: 'hero.tagline',
				class: 'font-manrope',
				breakBefore: true,
			},
		],
		description:
			'One transfer - countless possibilities. Pay remunerations in over 150 countries with minimal effort',
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'Book a demo',
			translateKey: 'hero.cta',
			kind: 'demo',
			trackingCta: 'hero_demo',
			variant: 'primary',
			effect: 'rotating-flare',
			wrapperClass: 'flex md:mb-24 mb-24 justify-center',
		},
		tone: 'green',
		align: 'center',
	},
	offer: {
		class: 'overflow-visible lg:pt-48 lg:pb-32 pt-32 pb-24 relative',
		containerClass: 'garna-container relative z-10',
		contentClass: 'flex flex-col text-center max-w-4xl mr-auto mb-16 ml-auto items-center',
		titleClass:
			'garna-hero-title-gradient text-5xl md:text-7xl font-normal tracking-tight font-manrope mb-6 leading-[1.1]',
		descriptionClass:
			'md:text-xl leading-relaxed text-lg font-light text-gray-400 font-manrope max-w-2xl mr-auto mb-10 ml-auto',
		badge: {
			text: 'For contractors & freelancers',
			translateKey: 'hero.badge',
		},
		title: [
			{ text: 'Get paid globally,', translateKey: 'hero.titleMain' },
			{
				text: 'hassle-free',
				translateKey: 'hero.titleAccent',
				breakBefore: true,
				breakClass: 'hidden md:block',
			},
		],
		description:
			'Receives payments from clients in the US, Europe or anywhere else in the world in seconds. With total transparency and complete legal support',
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'Get paid with Garna',
			translateKey: 'hero.cta',
			href: 'https://app.garna.io/en/auth/sign-up',
			kind: 'signup',
			variant: 'primary',
			wrapperClass: 'flex flex-col sm:flex-row items-center gap-4',
		},
		tone: 'green',
		align: 'center',
	},
	aiHiring: {
		class: 'overflow-hidden min-h-screen flex flex-col pt-32 pb-32 relative justify-center',
		containerClass: 'garna-container md:mt-0 lg:mt-16 z-10 w-full mt-0 relative',
		contentClass: 'font-manrope text-center max-w-4xl mr-auto mb-16 ml-auto',
		titleClass:
			'garna-hero-title-gradient md:text-7xl leading-[1.1] text-5xl font-normal tracking-tight font-manrope mb-8',
		descriptionClass:
			'leading-relaxed md:text-xl text-xl font-light text-gray-400 font-manrope max-w-2xl mr-auto mb-10 ml-auto',
		badge: {
			text: 'AI-Powered Recruitment',
			translateKey: 'hero.badge',
		},
		title: [
			{ text: 'Skip the pre-screens.', translateKey: 'hero.titleLine1' },
			{
				text: 'Hire proven talent instantly.',
				translateKey: 'hero.titleLine2',
				breakBefore: true,
			},
		],
		description:
			'Access pre-vetted talent. We conduct smart AI interviews and deliver verified reports, so you only meet the best',
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'Start hiring now',
			translateKey: 'hero.cta',
			href: 'https://horyx.com',
			kind: 'external',
			variant: 'primary',
			wrapperClass: 'flex flex-col sm:flex-row gap-4 gap-x-4 gap-y-4 items-center justify-center',
		},
		tone: 'neutral',
		align: 'split',
	},
	whiteLabel: {
		class: 'overflow-hidden min-h-screen flex flex-col pt-32 pb-32 relative justify-center',
		containerClass:
			'garna-container md:mt-0 lg:mt-16 z-10 w-full mt-0 relative flex flex-col lg:flex-row lg:gap-12 lg:items-start gap-x-12 gap-y-12 items-center',
		contentClass:
			'flex flex-col lg:w-5/12 xl:w-[45%] font-manrope mt-auto mb-auto gap-x-6 gap-y-6 items-start justify-start',
		titleClass:
			'garna-hero-title-gradient leading-[1.15] md:text-5xl lg:text-6xl text-4xl font-normal tracking-tight',
		descriptionClass:
			'md:text-xl leading-relaxed text-lg font-light text-gray-400 font-manrope max-w-xl',
		badge: {
			text: 'White Label contractor management & contractor of record platform',
			translateKey: 'hero.badge',
		},
		title: [{ text: 'White Label Payroll Solutions for Business', translateKey: 'hero.title' }],
		description:
			'Scale your business without operational chaos: automate compliance and global contractor payments under your own brand',
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'Try Demo Version',
			translateKey: 'hero.cta',
			kind: 'demo',
			trackingCta: 'hero_demo',
			variant: 'primary',
			effect: 'rotating-flare',
			wrapperClass: '',
		},
		tone: 'green',
		align: 'split',
	},
	eor: {
		class: 'relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24',
		containerClass: 'garna-container flex flex-col items-center gap-12',
		contentClass: 'mx-auto flex max-w-4xl flex-col items-center text-center',
		titleClass: 'garna-hero-title-gradient font-manrope text-5xl font-normal leading-[1.05] tracking-tight md:text-[64px]',
		descriptionClass: 'mx-auto mt-7 max-w-3xl text-lg font-light leading-relaxed text-gray-400 md:text-xl',
		badge: {
			text: 'Employer of Record for global teams',
			translateKey: 'hero.badge',
		},
		title: [{ text: 'Worldwide Employment Made Simple, Quick & Flawless', translateKey: 'hero.title' }],
		description:
			'Hiring the best talent from around the globe does not have to mean complex compliance rules, separate payroll systems, or new legal entities in every country. Garna gives companies a simple, modern Employer of Record solution for global hiring without operational hassle',
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'Book a demo',
			translateKey: 'hero.cta',
			kind: 'demo',
			trackingCta: 'eor_hero_book_demo',
			variant: 'primary',
			effect: 'hover-sweep',
			wrapperClass: 'mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row',
		},
		tone: 'green',
		align: 'center',
	},
	form: {
		class: 'lg:pb-32 lg:pt-16 pt-16 pb-24',
		containerClass: 'garna-container',
		contentClass: 'lg:mb-20 text-center max-w-3xl mr-auto mb-16 ml-auto',
		titleClass: 'garna-hero-title-gradient md:text-5xl text-3xl font-normal tracking-tight font-manrope mb-6',
		descriptionClass: 'text-xl font-light text-gray-400 font-manrope',
		title: [{ text: 'Book a free 30-minute product demo', translateKey: 'form.heading' }],
		description: 'Get all your questions answered by our experts',
		descriptionTranslateKey: 'form.subtitle',
		tone: 'green',
		align: 'center',
	},
} satisfies Record<string, HeroSectionConfig>;
