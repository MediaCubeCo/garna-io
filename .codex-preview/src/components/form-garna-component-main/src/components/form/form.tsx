import React from 'react';

import styles from './form.module.css';
import { IForm, IFormErrors } from '../modal/modal';
import InputForm from './inputForm';
import SelectForm from './selectForm';
import { COMPANY_SIZE_OPTIONS } from '../../utils/constant';

type FormChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

export interface IFormPlaceholders {
	firstName: string;
	lastName: string;
	email: string;
	employees: string;
}

const DEFAULT_PLACEHOLDERS: IFormPlaceholders = {
	firstName: 'First name*',
	lastName: 'Last name*',
	email: 'Work email*',
	employees: 'Number of employees*',
};

interface IFormParam {
	values: IForm;
	handleChange: (event: FormChangeEvent) => void;
	errorsMessages: IFormErrors;
	placeholders?: Partial<IFormPlaceholders>;
	companySizeOptions?: string[];
}

export default function Form({
	values,
	handleChange,
	errorsMessages,
	placeholders: placeholdersOverride,
	companySizeOptions = [...COMPANY_SIZE_OPTIONS],
}: IFormParam): React.JSX.Element {
	const placeholders = { ...DEFAULT_PLACEHOLDERS, ...placeholdersOverride };
	return (
		<form className={styles.form}>
			<div className={styles.nameRow}>
				<InputForm
					name={'firstName'}
					value={values.firstName}
					onChange={handleChange}
					placeholder={placeholders.firstName}
					type={'text'}
					errorsMessage={errorsMessages.firstName}
				/>
				<InputForm
					name={'lastName'}
					value={values.lastName}
					onChange={handleChange}
					placeholder={placeholders.lastName}
					type={'text'}
					errorsMessage={errorsMessages.lastName}
				/>
			</div>

			<InputForm
				name={'email'}
				value={values.email}
				onChange={handleChange}
				placeholder={placeholders.email}
				type={'email'}
				errorsMessage={errorsMessages.email}
			/>

			<SelectForm
				name={'numEmployes'}
				value={values.numEmployes}
				onChange={handleChange}
				placeholder={placeholders.employees}
				options={companySizeOptions}
				errorsMessage={errorsMessages.numEmployes}
			/>
		</form>
	);
}
