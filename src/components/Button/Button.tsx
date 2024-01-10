import { FC } from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

interface ButtonPropsType {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: FC<ButtonPropsType> = ({ text, onClick, disabled, type = 'button', className }) => {
  return (
    <button
      type={type}
      className={classNames(styles.button, { [styles.buttonDisabled]: disabled }, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
