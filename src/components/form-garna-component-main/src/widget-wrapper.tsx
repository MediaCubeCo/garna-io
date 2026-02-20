import React from 'react';
import Modal, { IModalProps } from './components/modal/modal';

interface WidgetWrapperProps {
	isOpen: boolean;
	onClose: () => void;
	config: Partial<IModalProps>;
}

export function WidgetWrapper({ isOpen, onClose, config }: WidgetWrapperProps): React.JSX.Element {
	const defaultConfig: IModalProps = {
		calComLink: 'garna/demo',
		titleButton: 'Book a Demo',
		titleButtonForm: 'Continue',
		title: 'Start your journey with Garna',
		subtitle: 'Fill in your details to book a demo',
		bgColorCal: '#0a0a0a',
		colorBrandBg: '#5ea500',
		colorBrandText: '#ffffff',
		colorBorder: 'rgb(34, 34, 34)',
		thicknessBorder: '1px',
		radiusBorder: '32px',
		colorTextMain: '#ffffff',
		colorTextCalendar: '#a4a4a4',
		colorTextError: 'pink',
		colorBorderTimeCalendar: '#ffffff9a',
		colorBorderVerticalLine: 'rgb(34, 34, 34)',
		colorTextLogo: '#5d5d5d',
		locale: 'en',
		...config,
	};

	return (
		<Modal
			{...defaultConfig}
			isModalVis={isOpen}
			onCloseModal={onClose}
			embedded={defaultConfig.embedded}
		/>
	);
}
