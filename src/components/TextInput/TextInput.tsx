import { FC, ChangeEvent } from 'react';
import styles from './TextInput.module.css';

interface InputPropsType {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeHolder: string;
  name: string;
  error?: string;
}
export const TextInput: FC<InputPropsType> = ({ onChange, name, value, placeHolder, error }) => {
  return (
    <div className={styles.container}>
      <input
        className={error ? `${styles.input} ${styles.inputError}` : styles.input}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeHolder}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
