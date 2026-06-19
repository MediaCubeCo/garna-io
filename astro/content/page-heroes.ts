import type { HeroSectionConfig } from '../types/hero-section';

export const pageHeroes = {
	home: {
		class: 'home-hero overflow-hidden md:pb-32 lg:pt-48 lg:pb-32 pt-32 pb-32 relative',
		containerClass:
			'garna-container overflow-visible z-10 text-center relative',
		titleClass:
			'garna-hero-title-gradient leading-[1.1] md:text-6xl lg:text-7xl text-5xl font-normal tracking-tight font-manrope mb-6',
		titleBreakAfterWords: {
			en: 3,
			es: 4,
			pt: 6,
		},
		descriptionClass:
			'leading-relaxed md:text-xl text-lg font-light text-gray-400 font-manrope max-w-3xl mr-auto mb-10 ml-auto',
		title: [{ text: 'Global Payroll Solutions for your business', translateKey: 'hero.title' }],
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
			wrapperClass: 'flex mb-16 justify-center',
		},
		tone: 'green',
		align: 'center',
	},
	offer: {
		class: 'overflow-visible pt-24 pb-24 md:pt-24 lg:pt-40 lg:pb-32 relative',
		containerClass: 'garna-container relative z-10',
		contentClass: 'flex flex-col text-center max-w-4xl mr-auto mb-16 ml-auto items-center',
		titleClass:
			'garna-hero-title-gradient text-5xl md:text-7xl font-normal tracking-tight font-manrope mb-6 leading-[1.1]',
		titleBreakAfterWords: {
			en: 3,
		},
		descriptionClass:
			'md:text-xl leading-relaxed text-lg font-light text-gray-400 font-manrope max-w-2xl mr-auto mb-10 ml-auto',
		badge: {
			text: 'For contractors & freelancers',
			translateKey: 'hero.badge',
		},
		title: [{ text: 'Get paid globally, hassle-free', translateKey: 'hero.titleMain' }],
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
		title: [{ text: 'Skip the pre-screens. Hire proven talent instantly.', translateKey: 'hero.titleLine1' }],
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
			class: 'garna-hero-badge-compact',
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
	payrollSmallBusiness: {
		class: 'relative overflow-hidden pt-36 pb-20 lg:min-h-screen lg:pt-44 lg:pb-28',
		containerClass: 'garna-container',
		contentClass:
			'relative z-10 flex max-w-3xl flex-col items-start justify-center pt-8 lg:min-h-[560px] lg:max-w-[520px] lg:pt-0 xl:max-w-[620px]',
		titleClass:
			'garna-hero-title-gradient max-w-3xl leading-[1.15] md:text-5xl lg:text-6xl text-4xl font-normal tracking-tight font-manrope',
		descriptionClass:
			'mt-7 md:text-xl leading-relaxed text-lg font-light text-gray-400 font-manrope max-w-xl',
		badge: {
			text: 'Built for small global teams',
			translateKey: 'hero.badge',
		},
		title: [{ text: 'Global Payroll Solution for Small Businesses', translateKey: 'hero.title' }],
		description:
			'Hire employees and pay contractors all over the world. Everything in one platform: from taxes and contracts to one-click bulk payments',
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'Try Garna',
			translateKey: 'hero.cta',
			href: 'https://app.garna.io/en/auth/sign-up',
			kind: 'signup',
			variant: 'primary',
			effect: 'rotating-flare',
			wrapperClass: 'mt-9 flex flex-col items-start gap-4 sm:flex-row sm:justify-start',
		},
		tone: 'green',
		align: 'split',
	},
	payrollSolutionNew: {
		class: 'payroll-solution-new-hero overflow-hidden md:pb-32 lg:pt-48 lg:pb-32 pt-32 pb-32 relative',
		containerClass:
			'overflow-visible md:px-12 md:pt-12 md:pb-0 text-center max-w-7xl z-10 mr-auto ml-auto pt-12 pr-6 pb-12 pl-6 relative',
		titleClass:
			'garna-hero-title-gradient leading-[1.1] lg:text-8xl lg:mb-12 md:mb-8 md:text-7xl text-6xl font-light tracking-tight font-extralight mb-8',
		descriptionClass:
			'leading-relaxed lg:text-2xl md:text-xl lg:mb-16 text-xl font-light text-gray-400 font-manrope max-w-4xl mr-auto mb-12 ml-auto',
		title: [{ text: 'Global Payroll Solution for International Businesses', translateKey: 'hero.titleMain' }],
		description:
			'Save time and money while working with contractors and hiring employees in 150+ country. Full legal compliance without the extra costs - this and more, with Garna',
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'Book a demo',
			translateKey: 'hero.cta',
			kind: 'demo',
			trackingCta: 'payroll_solution_new_hero_demo',
			variant: 'primary',
			effect: 'rotating-flare',
			wrapperClass: 'flex justify-center',
		},
		tone: 'green',
		align: 'center',
	},
	eor: {
		class: 'relative overflow-hidden pt-36 pb-20 md:pt-40 md:pb-24 lg:pt-44',
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
		titleClass: 'garna-hero-title-gradient md:text-5xl text-3xl leading-[1.15] pb-[0.08em] font-normal tracking-tight font-manrope mb-6',
		descriptionClass: 'text-xl font-light text-gray-400 font-manrope',
		title: [{ text: 'Book a free 30-minute product demo', translateKey: 'form.heading' }],
		description: 'Get all your questions answered by our experts',
		descriptionTranslateKey: 'form.subtitle',
		tone: 'green',
		align: 'center',
	},
} satisfies Record<string, HeroSectionConfig>;
