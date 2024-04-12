import { Users } from '@/components/pages/users/Users';
import { UsersProvider } from '@/components/pages/users/providers/userProvider';

const UsersPage = () => {
  return (
    <UsersProvider>
      <Users />
    </UsersProvider>
  );
};

export default UsersPage;
