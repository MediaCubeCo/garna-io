import React from 'react';
import styles from './button.module.css';

interface IButton {
	label: string;
	icon?: React.ReactNode;
	onClick?: () => void;
}

export default function Button({ label, icon, onClick = () => {} }: IButton): React.JSX.Element {
	return (
		<button className={styles.button} onClick={onClick} type="button">
			{icon && <span className={styles.buttonIcon}>{icon}</span>}
			{label}
		</button>
	);
}
