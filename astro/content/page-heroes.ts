import type { HeroSectionConfig } from '../types/hero-section';

export const pageHeroes = {
	gamescom2026: {
		class: 'gamescom-hero relative overflow-hidden',
		containerClass: 'gamescom-container relative z-10',
		contentClass: 'gamescom-hero-content reveal',
		titleClass: 'gamescom-hero-title font-manrope font-normal tracking-tight',
		descriptionClass: 'gamescom-hero-lead font-manrope',
		badge: {
			text: 'Gamescom 2026 · Cologne · 23–30 August',
			translateKey: 'hero.badge',
		},
		title: [
			{ text: 'Your Gamescom 2026', translateKey: 'hero.titleLead' },
			{ text: 'side events', translateKey: 'hero.titleAccent' },
			{ text: 'guide', translateKey: 'hero.titleTail' },
		],
		description:
			'Mixers, dinners, pitch sessions, pavilion receptions, and the parties that run till morning. We checked every link and wrote down how to get in. The list stays updated through the show.',
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'What Garna does',
			translateKey: 'hero.learnCta',
			href: '/en',
			kind: 'home',
			variant: 'primary',
			effect: 'rotating-flare',
			icon: 'none',
			wrapperClass: 'gamescom-hero-actions flex flex-wrap gap-3',
		},
		ctaSecondary: {
			label: 'Get PDF',
			translateKey: 'hero.pdfCta',
			href: '/Garna-Gamescom-2026-Side-Events.pdf',
			target: '_blank',
			rel: 'noopener noreferrer',
			kind: 'external',
			variant: 'secondary',
			icon: 'arrow-up-right',
		},
		tone: 'neutral',
		align: 'split',
	},
	contractorOfRecord: {
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
			'leading-relaxed md:text-xl text-lg font-manrope max-w-3xl mr-auto mb-10 ml-auto',
		descriptionBreakAfterWords: { en: 11 },
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
	enterprisePayroll: {
		class: 'home-hero overflow-hidden md:pb-32 lg:pt-48 lg:pb-32 pt-32 pb-32 relative',
		containerClass:
			'garna-container overflow-visible z-10 text-center relative',
		titleClass:
			'garna-hero-title-gradient leading-[1.1] md:text-6xl lg:text-7xl text-5xl font-normal tracking-tight font-manrope mb-6',
		titleBreakAfterWords: {
			en: 3,
		},
		descriptionClass:
			'leading-relaxed md:text-xl text-lg font-manrope max-w-4xl mr-auto mb-10 ml-auto',
		descriptionBreakAfterWords: { en: 11 },
		badge: {
			text: 'Enterprise Payroll',
			translateKey: 'hero.badge',
		},
		title: [{ text: 'Scaling Payroll Infrastructure Made for Global Businesses', translateKey: 'hero.title' }],
		description:
			'A centralized global payroll system designed to handle operations across countries, different entities, contractors and employees without sacrificing any flexibility',
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'Try Garna',
			translateKey: 'hero.cta',
			href: 'https://app.garna.io/en/auth/sign-up',
			kind: 'signup',
			variant: 'primary',
			effect: 'rotating-flare',
			wrapperClass: 'flex mb-16 justify-center',
		},
		tone: 'green',
		align: 'center',
	},
	midSize: {
		class: 'home-hero min-h-screen overflow-hidden pt-36 pb-20 md:pt-40 md:pb-24 lg:pt-44 relative',
		containerClass:
			'garna-container overflow-visible z-10 text-center relative w-full',
		contentClass: 'mx-auto max-w-5xl',
		titleClass:
			'garna-hero-title-gradient leading-[1.1] md:text-6xl lg:text-7xl text-5xl font-normal tracking-tight font-manrope mb-6',
		descriptionClass:
			'leading-relaxed md:text-xl text-lg font-manrope max-w-4xl mr-auto mb-10 ml-auto',
		title: [{ text: 'Payroll for Growing Companies', translateKey: 'hero.title' }],
		description:
			'A solution that keeps up with your growing business - a scalable platform that lets you put payroll on autopilot, manage employees and contractors from a single place',
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'Try Garna',
			translateKey: 'hero.cta',
			href: 'https://app.garna.io/en/auth/sign-up',
			kind: 'signup',
			variant: 'primary',
			effect: 'rotating-flare',
			wrapperClass: 'flex justify-center',
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
			'md:text-xl leading-relaxed text-lg font-manrope max-w-2xl mr-auto mb-10 ml-auto',
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
			'leading-relaxed md:text-xl text-xl font-manrope max-w-2xl mr-auto mb-10 ml-auto',
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
			'md:text-xl leading-relaxed text-lg font-manrope max-w-xl',
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
			'mt-7 md:text-xl leading-relaxed text-lg font-manrope max-w-xl',
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
	home: {
		class: 'payroll-solution-new-hero relative mb-16 h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden pt-24 pb-24 md:mb-24 md:pt-28 md:pb-32 lg:mb-32 lg:pt-32 lg:pb-40',
		containerClass:
			'relative z-10 mx-auto h-full max-w-7xl overflow-visible px-6 pb-8 pt-4 text-center md:px-12 md:pt-5',
		contentClass: 'relative z-10 pb-16 md:pb-24 lg:pb-32',
		titleClass:
			'garna-hero-title-gradient mb-3 text-[2.75rem] leading-[1.06] tracking-tight md:mb-4 md:text-[3.35rem] lg:mb-5 lg:text-[70px] lg:whitespace-nowrap',
		descriptionClass:
			'mx-auto mb-5 max-w-3xl text-center font-manrope text-lg leading-relaxed !text-white opacity-70 [text-shadow:0_2px_18px_rgba(0,0,0,0.72)] md:mb-6 md:text-lg lg:mb-7 lg:text-xl lg:whitespace-nowrap',
		title: [{ text: 'The All in One Payroll Platform', translateKey: 'hero.titleMain' }],
		description: 'Hire, pay, and manage global teams without setting up local entities',
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'Book a demo',
			translateKey: 'hero.cta',
			kind: 'demo',
			trackingCta: 'payroll_solution_new_hero_demo',
			variant: 'primary',
			effect: 'rotating-flare',
			wrapperClass: 'relative z-20 flex justify-center',
		},
		tone: 'neutral',
		align: 'center',
	},
	eor: {
		class: 'relative overflow-hidden pt-36 pb-20 md:pt-40 md:pb-24 lg:pt-44',
		containerClass: 'garna-container flex flex-col items-center gap-12',
		contentClass: 'mx-auto flex max-w-4xl flex-col items-center text-center',
		titleClass: 'garna-hero-title-gradient font-manrope text-5xl font-normal leading-[1.05] tracking-tight md:text-[64px]',
		descriptionClass: 'mx-auto mt-7 max-w-3xl text-lg leading-relaxed md:text-xl',
		title: [{ text: 'Worldwide Employment Made Simple, Quick & Flawless', translateKey: 'hero.title' }],
		description:
			"Hiring the best talent from around the globe doesn't have to be a set of complex compliance rules, separate payroll systems where you have to create multiple legal entities in each country. At Garna, we provide a simple, modern employer of record solution designed to help businesses expand globally without getting stuck in operational hassles",
		descriptionTranslateKey: 'hero.description',
		cta: {
			label: 'Book demo',
			translateKey: 'hero.cta',
			kind: 'demo',
			trackingCta: 'eor_hero_book_demo',
			variant: 'primary',
			effect: 'rotating-flare',
			wrapperClass: 'mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row',
		},
		tone: 'green',
		align: 'center',
	},
	form: {
		class: 'garna-form-page lg:pb-32 lg:pt-16 pt-16 pb-24 relative z-10 isolate',
		containerClass: 'garna-container relative z-10',
		contentClass: 'lg:mb-20 text-center max-w-3xl mr-auto mb-16 ml-auto',
		titleClass: 'garna-hero-title-gradient md:text-5xl text-3xl leading-[1.15] pb-[0.08em] font-normal tracking-tight font-manrope mb-6',
		descriptionClass: 'text-xl font-manrope',
		title: [{ text: 'Book a free 30-minute product demo', translateKey: 'form.heading' }],
		description: 'Get all your questions answered by our experts',
		descriptionTranslateKey: 'form.subtitle',
		tone: 'green',
		align: 'center',
	},
} satisfies Record<string, HeroSectionConfig>;
