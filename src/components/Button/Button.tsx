import { FC } from 'react';
import { StyledButton } from '@/components/Button/ButtonStyles';

interface ButtonPropsType {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}
export const Button: FC<ButtonPropsType> = ({ text, onClick, disabled }) => {
  return (
    <StyledButton.Button onClick={onClick} disabled={disabled}>
      {text}
    </StyledButton.Button>
  );
};
