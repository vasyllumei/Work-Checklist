import { FC } from 'react';
import { StyledButton } from '@/components/Button/ButtonStyles';

interface ButtonPropsType {
  text: string;
  onClick: () => void;
}

export const Button: FC<ButtonPropsType> = ({ text, onClick }) => {
  return <StyledButton.Button onClick={onClick}>{text}</StyledButton.Button>;
};
