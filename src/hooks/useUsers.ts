import { createUser, deleteAllUsers, deleteUser, getAllUsers, updateUser } from '@/services/user/userService';
import { UserType } from '@/types/User';
import { useCallback, useState } from 'react';

export const useUsers = () => {
  const [users, setUsers] = useState<UserType[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const fetchedUsersData = await getAllUsers();
      const fetchedUsers = fetchedUsersData.data;
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error retrieving the list of users:', error);
    }
  }, []);

  const handleUserCreate = async (userData: UserType) => {
    try {
      await createUser(userData);
      await fetchUsers();
    } catch (error: any) {
      console.error('Error creating the user:', error);
      throw error.response?.data?.message || 'Failed to create user';
    }
  };

  const handleUserDelete = async (userId: string): Promise<void> => {
    try {
      await deleteUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting the user:', error);
    }
  };

  const handleDeleteAllUsers = async (userIds: string[]) => {
    try {
      await deleteAllUsers(userIds);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting selected users:', error);
    }
  };

  const handleUserEdit = async (userId: string, userData: UserType) => {
    try {
      await updateUser(userId, userData);
      await fetchUsers();
    } catch (error) {
      console.error('Error updating the user', error);
    }
  };

  return {
    users,
    fetchUsers,
    handleUserCreate,
    handleUserDelete,
    handleDeleteAllUsers,
    handleUserEdit,
  };
};
