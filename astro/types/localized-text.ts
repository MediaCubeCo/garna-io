export interface LocalizedText {
	text: string;
	translateKey: string;
}

export type SectionTone = 'default' | 'subtle' | 'accent';
export type SectionWidth = 'narrow' | 'content' | 'wide';
export type SectionLayout = 'stack' | 'split' | 'grid';
