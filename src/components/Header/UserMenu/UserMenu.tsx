import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from '@/components/Header/UserMenu/UserMenu.module.css';
import { useRouter } from 'next/router';
import { LOCAL_STORAGE_TOKEN } from '@/constants';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { getAllUsers } from '@/services/user/userService';
import { UserType } from '@/types/User';

export const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        setCurrentUser(userId);
        const fetchedUsersData = await getAllUsers();
        const fetchedUsers: UserType[] = fetchedUsersData.data;
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove(LOCAL_STORAGE_TOKEN);
    router.push('/login');
  };

  const userDisplayDataMap = new Map();

  users?.map(user => {
    const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;
    const backgroundColor = user.iconColor ?? 'blue';

    userDisplayDataMap.set(currentUser, { initials, backgroundColor });
  });

  return (
    <div className={styles.headerAvatar}>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <div
          className={styles.imageContainer}
          style={{
            backgroundColor: userDisplayDataMap.get(currentUser)?.backgroundColor || 'blue',
          }}
        >
          {userDisplayDataMap.get(currentUser)?.initials}
        </div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};
