import React, { FC, useState } from 'react';
import styles from './TextInput.module.css';
import classNames from 'classnames';

interface InputPropsType {
  value: string;
  onChange: (value: string) => void;
  placeHolder: string;
  name: string;
  error?: string;
  type?: 'text' | 'password' | 'email';
  onBlur?: () => void;
  onFocus?: () => void;
  label?: string;
}

export const TextInput: FC<InputPropsType> = ({
  onChange,
  onBlur,
  name,
  value,
  placeHolder,
  error,
  type = 'text',
  onFocus,
  label,
}) => {
  const [inputType, setInputType] = useState(type === 'password' ? 'password' : 'text');

  return (
    <div className={styles.container}>
      {type === 'password' && (
        <div
          className={styles.eyePassword}
          onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}
        />
      )}
      {label && <label className={styles.inputField}>{label}</label>}
      <input
        className={classNames(styles.input, { [styles.inputError]: error })}
        name={name}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeHolder}
        type={inputType}
        onBlur={onBlur}
        onFocus={onFocus}
      />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
