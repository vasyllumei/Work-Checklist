import { FC } from 'react';
import styles from './TextInput.module.css';
import classNames from 'classnames';

interface InputPropsType {
  value: string;
  onChange: (value: string) => void;
  placeHolder: string;
  name: string;
  error?: string;
}
export const TextInput: FC<InputPropsType> = ({ onChange, name, value, placeHolder, error }) => {
  return (
    <div className={styles.container}>
      <input
        className={classNames(styles.input, { [styles.inputError]: error })}
        name={name}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeHolder}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
