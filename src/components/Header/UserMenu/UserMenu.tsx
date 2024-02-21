import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from '@/components/Header/UserMenu/UserMenu.module.css';
import { useRouter } from 'next/router';
import { LOCAL_STORAGE_TOKEN } from '@/constants';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

interface UserDisplayData {
  initials: string;
  backgroundColor: string;
}

export const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const currentUserString = localStorage.getItem('currentUser');
  const [userDisplayData, setUserDisplayData] = useState<UserDisplayData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);

      const initials = `${currentUser.user.firstName?.[0] ?? ''}${currentUser.user.lastName?.[0] ?? ''}`;
      const backgroundColor = currentUser.user.iconColor ?? 'blue';

      setUserDisplayData({ initials, backgroundColor });
    }
  }, []);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove(LOCAL_STORAGE_TOKEN);
    localStorage.clear();
    router.push('/login');
  };

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
            backgroundColor: userDisplayData?.backgroundColor || 'blue',
          }}
        >
          {userDisplayData?.initials}
        </div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
