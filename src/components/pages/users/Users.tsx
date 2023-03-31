import { useEffect, useState } from 'react';
import { getUsers } from '@/services/user/userService';
import { UserType } from '@/types/User';
import { StyledUsers } from '@/components/pages/users/UsersStyles';

export default function Users() {
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
    </StyledUsers.Container>
  );
}
