import { FC } from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

interface ButtonPropsType {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}
export const Button: FC<ButtonPropsType> = ({ text, onClick, disabled }) => {
  return (
    <button
      className={classNames(styles.button, { [styles.buttonDisabled]: disabled })}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
