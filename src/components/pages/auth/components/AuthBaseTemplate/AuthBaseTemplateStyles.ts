import { styled } from '@mui/material/styles';

export const StyledAuthBaseTemplate = {
  Container: styled('div')({
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    flex: 1,
  }),
  Left: styled('div')({
    height: '100vh',
    width: '50%',
  }),
  Right: styled('div')({
    height: '100vh',
    width: '50%',
    background: 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)',
    borderRadius: '0px 0px 0px 200px',
  }),
};
