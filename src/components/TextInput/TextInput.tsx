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
}

export const TextInput: FC<InputPropsType> = ({ onChange, name, value, placeHolder, error, type = 'text' }) => {
  const [focused, setFocused] = useState(false);
  const [inputType, setInputType] = useState(type === 'password' ? 'password' : 'text');
  const showError = error && focused;

  return (
    <div className={styles.container}>
      <input
        className={classNames(styles.input, { [styles.inputError]: error })}
        name={name}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeHolder}
        type={inputType}
        onFocus={() => {
          setFocused(true);
        }}
      />
      {type === 'password' && (
        <div
          className={styles.eyePassword}
          onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}
        />
      )}
      {showError && (
        <span className={styles.error} onClick={() => setFocused(true)}>
          {error}
        </span>
      )}
    </div>
  );
};
