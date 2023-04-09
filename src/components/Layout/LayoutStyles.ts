import { styled } from '@mui/material/styles';

export const StyledLayout = {
  Container: styled('div')({
    background: '#F4F7FE',
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flex: 1,
  }),
  Menu: styled('div')({
    width: '290px',
    height: '500px',
    background: '#ffffff',
    borderBottomRightRadius: '20px',
  }),
  Content: styled('div')({
    width: '100%',
    height: '100vh',
    overflowY: 'scroll',
    padding: 20,
  }),
};
