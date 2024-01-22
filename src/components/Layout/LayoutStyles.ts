import { styled } from '@mui/system';

export const StyledLayout = {
  Container: styled('div')({
    background: '#F4F7FE',
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flex: 1,
  }),
  Menu: styled('div')({
    maxWidth: '290px',
    height: '100vh',
    background: '#ffffff',
    borderBottomRightRadius: '20px',
  }),
  Content: styled('div')({
    flex: 1,
    overflowY: 'auto',
    padding: 20,
  }),
};
