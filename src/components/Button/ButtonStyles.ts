import { styled } from '@mui/material/styles';

export const StyledButton = {
  Button: styled('button')(({ disabled }) => ({
    padding: '10px 8px',
    width: '100%',
    maxWidth: 410,
    height: 54,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)',
    backgroundColor: disabled ? '#c6bdec' : '#4318fe',
    color: disabled ? '#625e5e' : '#fff',
    borderRadius: '16px',
    border: '1px solid #000000',
  })),
};
