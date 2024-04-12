import { useContext } from 'react';
import { UsersContext } from '@/components/pages/users/providers/userProvider/UsersContext';

export const useUsersContext = () => {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
};
