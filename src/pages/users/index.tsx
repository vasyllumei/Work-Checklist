import { styled } from '@mui/material/styles';

const StyledUsers = {
  Container: styled('div')({
    display: 'flex',
    alignItems: 'start',
    width: '100%',
  }),
  List: styled('div')({
    display: 'flex',
  }),
};

export default function Users() {
  return (
    <StyledUsers.Container>
      <StyledUsers.List>Users</StyledUsers.List>
    </StyledUsers.Container>
  );
}
