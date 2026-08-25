import React from 'react';
import styles from './button.module.css';

interface IButton {
	label: string;
	icon?: React.ReactNode;
	onClick?: () => void;
}

export default function Button({ label, icon, onClick = () => {} }: IButton): React.JSX.Element {
	return (
		<button
			className={`${styles.button} garna-button garna-button-primary garna-button-rotating-flare text-garna-accent-foreground`}
			onClick={onClick}
			type="button"
		>
			<span className={`${styles.buttonInner} garna-button-inner`}>
				{icon && <span className={styles.buttonIcon}>{icon}</span>}
				{label}
			</span>
		</button>
	);
}
