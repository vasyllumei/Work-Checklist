import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from '@/components/Header/UserMenu/UserMenu.module.css';
import { useRouter } from 'next/router';
import { LOCAL_STORAGE_TOKEN } from '@/constants';
import Cookies from 'js-cookie';
import { UserType } from '@/types/User';
import { useEffect, useState } from 'react';
interface UserMenuProps {
  users: UserType[];
}
export const UserMenu: React.FC<UserMenuProps> = ({ users }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    setCurrentUser(userId);
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

  users.map(user => {
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
