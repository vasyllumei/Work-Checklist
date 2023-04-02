import { FC, useEffect, useState } from 'react';
import { getUsers } from '@/services/user/userService';
import { UserType } from '@/types/User';
import { StyledUsers } from '@/components/pages/users/UsersStyles';
import { Button } from '@/components/Button';

export const Users: FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);

  const fetchUsers = async () => {
    const { data } = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log('users', users);

  return (
    <StyledUsers.Container>
      <StyledUsers.List>Users</StyledUsers.List>
      <Button text="Test text" onClick={() => console.log('hello')} />
    </StyledUsers.Container>
  );
};
