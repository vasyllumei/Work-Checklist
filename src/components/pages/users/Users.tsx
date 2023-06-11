import { FC, useEffect, useState } from 'react';
import { getUsers } from '@/services/user/userService';
import { UserType } from '@/types/User';
import { Layout } from '@/components/Layout/Layout';

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
    <Layout headTitle="Portal | Users">
      <div>
        ggg
        {users.map(user => (
          <div key={user.email}>{user.email}</div>
        ))}
      </div>
    </Layout>
  );
};
