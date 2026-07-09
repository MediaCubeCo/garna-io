export type FAQVariant = 'standard' | 'eor';

export interface FAQText {
	text: string;
	translateKey?: string;
}

export interface FAQItem {
	question: string;
	answer: string;
	questionTranslateKey: string;
	answerTranslateKey: string;
}

export interface FAQSectionConfig {
	id?: string;
	kicker?: FAQText;
	title: FAQText;
	subtitle?: FAQText;
	items: FAQItem[];
	variant?: FAQVariant;
	class?: string;
	containerClass?: string;
	accordionClass?: string;
}
