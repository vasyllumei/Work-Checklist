import { FC } from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

interface ButtonPropsType {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  size: 'small' | 'medium' | 'large';
  outlined?: boolean;
  dataTestId?: string;
}

export const Button: FC<ButtonPropsType> = ({
  text,
  onClick,
  disabled,
  type = 'button',
  className,
  size,
  outlined,
  dataTestId,
}) => {
  const buttonSize = styles[size];
  return (
    <button
      data-testid={dataTestId}
      type={type}
      className={classNames(
        styles.button,
        { [styles.buttonDisabled]: disabled },
        { [styles.outlined]: outlined },
        buttonSize,
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
