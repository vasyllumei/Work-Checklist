import { FC, useState } from 'react';
import styles from './TextInput.module.css';
import classNames from 'classnames';

interface InputPropsType {
  value: string;
  onChange: (value: string) => void;
  placeHolder: string;
  name: string;
  error?: string;
  type?: string;
  onBlur: (value: string) => void;
}
export const TextInput: FC<InputPropsType> = ({ onChange, name, value, placeHolder, error, type, onBlur }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className={styles.container}>
      <input
        className={classNames(styles.input, { [styles.inputError]: error })}
        name={name}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeHolder}
        type={type}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur(value);
        }}
      />
      {!focused && error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
