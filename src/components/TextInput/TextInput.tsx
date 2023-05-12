import { FC, ChangeEvent } from 'react';
import styles from './TextInput.module.css';

interface InputPropsType {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeHolder: string;
  name: string;
  className?: string;
}
export const TextInput: FC<InputPropsType> = ({ onChange, name, value, placeHolder, className }) => {
  return (
    <input
      className={`${styles.input} ${className}`}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeHolder}
    />
  );
};
