import React, { useState, useRef, useEffect } from 'react';
import styles from './selectForm.module.css';

export interface SelectOption {
	value: string;
	label: string;
}

interface ISelectForm {
	name: string;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	placeholder: string;
	options: readonly string[] | SelectOption[];
	errorsMessage: string;
	required?: boolean;
}

function normalizeOptions(options: readonly string[] | SelectOption[]): SelectOption[] {
	return options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
}

function createSyntheticChangeEvent(name: string, value: string): React.ChangeEvent<HTMLSelectElement> {
	return {
		target: { name, value },
	} as React.ChangeEvent<HTMLSelectElement>;
}

export default function SelectForm({
	name,
	value,
	onChange,
	placeholder,
	options,
	errorsMessage,
	required = true,
}: ISelectForm): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const containerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const opts = normalizeOptions(options);
	const valueOption = opts.find((o) => o.value === value);
	const displayText = valueOption ? valueOption.label : '';

	useEffect(() => {
		if (!isOpen) return;
		setHighlightedIndex(value ? opts.findIndex((o) => o.value === value) : -1);
	}, [isOpen, value, opts]);

	useEffect(() => {
		if (!isOpen || highlightedIndex < 0) return;
		listRef.current?.children[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
	}, [isOpen, highlightedIndex]);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	function handleKeyDown(e: React.KeyboardEvent) {
		if (!isOpen) {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				e.preventDefault();
				setIsOpen(true);
			}
			return;
		}
		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				setIsOpen(false);
				break;
			case 'ArrowDown':
				e.preventDefault();
				setHighlightedIndex((i) => (i < opts.length - 1 ? i + 1 : i === -1 ? 0 : i));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setHighlightedIndex((i) => (i > 0 ? i - 1 : i === -1 ? opts.length - 1 : 0));
				break;
			case 'Enter':
				e.preventDefault();
				if (highlightedIndex >= 0 && opts[highlightedIndex]) {
					onChange(createSyntheticChangeEvent(name, opts[highlightedIndex].value));
					setIsOpen(false);
				}
				break;
			default:
				break;
		}
	}

	function selectOption(opt: SelectOption) {
		onChange(createSyntheticChangeEvent(name, opt.value));
		setIsOpen(false);
	}

	return (
		<div ref={containerRef} className={styles.label}>
			<div
				role="combobox"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-invalid={!!errorsMessage}
				aria-describedby={errorsMessage ? `${name}-error` : undefined}
				aria-controls={`${name}-listbox`}
				tabIndex={0}
				className={`${styles.trigger} ${errorsMessage ? styles.error : ''} ${isOpen ? styles.triggerOpen : ''}`}
				onClick={() => setIsOpen((o) => !o)}
				onKeyDown={handleKeyDown}
			>
				<span className={`${styles.triggerText} ${!value ? styles.triggerPlaceholder : ''}`}>
					{displayText || placeholder}
				</span>
				<span className={styles.arrow} aria-hidden>
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M3 4.5L6 7.5L9 4.5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			</div>
			<div className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ''}`}>
				<ul ref={listRef} id={`${name}-listbox`} role="listbox" aria-label={placeholder} className={styles.list}>
					{opts.map((opt, i) => (
						<li
							key={opt.value}
							role="option"
							aria-selected={value === opt.value}
							className={`${styles.option} ${value === opt.value ? styles.optionSelected : ''} ${
								i === highlightedIndex ? styles.optionHighlighted : ''
							}`}
							onClick={() => selectOption(opt)}
							onMouseEnter={() => setHighlightedIndex(i)}
						>
							{opt.label}
						</li>
					))}
				</ul>
			</div>
			{errorsMessage && (
				<p id={`${name}-error`} className={styles.errorMessage}>
					{errorsMessage}
				</p>
			)}
		</div>
	);
}
