import React, { useState } from 'react';

type FormChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

interface TUseForm<T> {
	values: T;
	setValues: (state: T) => void;
	handleChange: (event: FormChangeEvent) => void;
}

export function useForm<T>(initialState: T): TUseForm<T> {
	const [values, setValues] = useState(initialState);

	const handleChange = (event: FormChangeEvent) => {
		const { name, value } = event.target;
		setValues((prev) => ({ ...prev, [name]: value }));
	};
	return { values, setValues, handleChange };
}
