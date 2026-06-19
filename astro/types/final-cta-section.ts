export type FinalCTALayout = 'center' | 'split';
export type FinalCTAVisual = 'ai-hiring' | 'white-label';
export type FinalCTAButtonKind = 'demo' | 'signup' | 'external';
export type FinalCTAButtonEffect = 'none' | 'rotating-flare';
export type FinalCTAButtonIcon = 'none' | 'arrow-up-right' | 'arrow-right';

export interface FinalCTAText {
	text: string;
	translateKey?: string;
	class?: string;
}

export interface FinalCTAButton {
	label: string;
	translateKey?: string;
	href?: string;
	kind?: FinalCTAButtonKind;
	trackingCta?: string;
	effect?: FinalCTAButtonEffect;
	icon?: FinalCTAButtonIcon;
}

export interface FinalCTASectionConfig {
	title: FinalCTAText[];
	description: FinalCTAText;
	button: FinalCTAButton;
	layout?: FinalCTALayout;
	visual?: FinalCTAVisual;
	class?: string;
	containerClass?: string;
	contentClass?: string;
	titleClass?: string;
	descriptionClass?: string;
}
