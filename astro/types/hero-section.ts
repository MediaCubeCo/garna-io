export type HeroTone = 'green' | 'neutral';
export type HeroAlign = 'center' | 'split';
export type HeroCtaKind = 'demo' | 'signup' | 'external';
export type HeroCtaVariant = 'primary' | 'secondary' | 'ghost' | 'icon' | 'glow';
export type HeroCtaEffect = 'none' | 'rotating-flare' | 'hover-sweep';
export type HeroCtaIcon = 'none' | 'arrow-up-right' | 'arrow-right';

export interface HeroTextPart {
	text: string;
	translateKey: string;
}

export interface HeroCta {
	label: string;
	translateKey: string;
	href?: string;
	kind?: HeroCtaKind;
	trackingCta?: string;
	class?: string;
	wrapperClass?: string;
	variant?: HeroCtaVariant;
	effect?: HeroCtaEffect;
	icon?: HeroCtaIcon;
}

export interface HeroBadge {
	text: string;
	translateKey: string;
	class?: string;
}

export interface HeroSectionConfig {
	class?: string;
	containerClass?: string;
	contentClass?: string;
	titleClass?: string;
	titleBreakAfterWords?: number | Record<string, number>;
	descriptionClass?: string;
	badge?: HeroBadge;
	title: HeroTextPart[];
	description?: string;
	descriptionTranslateKey?: string;
	cta?: HeroCta;
	tone?: HeroTone;
	align?: HeroAlign;
}
