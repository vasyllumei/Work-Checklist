import React, { FC, useState } from 'react';
import styles from './TextInput.module.css';
import classNames from 'classnames';

interface InputPropsType {
  value: string;
  onChange: (value: string) => void;
  placeHolder: string;
  name: string;
  error?: string;
  type?: string;
}

export const TextInput: FC<InputPropsType> = ({ onChange, name, value, placeHolder, error }) => {
  const [focused, setFocused] = useState(false);
  const [inputType, setInputType] = useState(name === 'password' ? 'password' : 'text'); // Set inputType state based on the name prop

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
          if (!error) {
            setFocused(true);
          }
        }}
        onBlur={() => {
          setFocused(false);
        }}
      />
      {name === 'password' && (
        <div
          className={styles.eyePassword}
          onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}
        />
      )}
      {!focused && error && (
        <span className={styles.error} onClick={() => setFocused(true)}>
          {error}
        </span>
      )}
    </div>
  );
};
