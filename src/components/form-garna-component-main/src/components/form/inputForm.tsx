import React from "react";
import styles from "./inputForm.module.css";

interface IinputForm {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type: string;
  errorsMessage: string;
  required?: boolean;
}

export default function InputForm({
  name,
  value,
  onChange,
  placeholder,
  type,
  errorsMessage,
  required = true,
}: IinputForm): React.JSX.Element {
  return (
    <label className={styles.label}>
      <input
        className={`${styles.input} ${errorsMessage && styles.error}`}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
      />
      {errorsMessage && <p className={styles.errorMessage}>{errorsMessage}</p>}
    </label>
  );
}
