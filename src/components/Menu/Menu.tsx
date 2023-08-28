import classNames from 'classnames';
import React, { FC, useState } from 'react';
import styles from './Menu.module.css';
import { useRouter } from 'next/router';
import DashboardIcon from '../../assets/image/menuicon/dashboardicon.svg';
import MarketPlaceIcon from '../../assets/image/menuicon/marketplaceIcon.svg';
import TablesIcon from '../../assets/image/menuicon/tablesIcon.svg';
import KanbanIcon from '../../assets/image/menuicon/kanbasicon.svg';
import ProfileIcon from '../../assets/image/menuicon/prifoleicon.svg';
import SignInIcon from '../../assets/image/menuicon/signinicon.svg';
import SettingIcon from '../../assets/image/menuicon/settingicon.svg';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

export const pages = [
  { id: 1, title: 'Dashboard', link: '/', disabled: false, icon: DashboardIcon },
  { id: 2, title: 'Users', link: '/users', disabled: false, icon: MarketPlaceIcon },
  { id: 3, title: 'Tables', link: '/tables', disabled: false, icon: TablesIcon },
  { id: 4, title: 'Kanban', link: '/kanban', disabled: false, icon: KanbanIcon },
  {
    id: 5,
    title: 'Profile',
    link: '/profile',
    disabled: false,
    icon: ProfileIcon,
    children: [
      { id: 10, title: 'Profile', link: '/1', disabled: false, icon: DashboardIcon },
      { id: 11, title: 'Setting', link: '/1', disabled: false, icon: SettingIcon },
    ],
  },
  {
    id: 6,
    title: 'Sign In',
    link: '/signin',
    disabled: false,
    icon: SignInIcon,
    children: [
      { id: 20, title: 'Profile', link: '/1', disabled: false, icon: DashboardIcon },
      { id: 21, title: 'Setting', link: '/1', disabled: false, icon: SettingIcon },
    ],
  },
  { id: 7, title: 'Setting', link: '/menulist', disabled: false, icon: SettingIcon },
];

export const Menu: FC = () => {
  const router = useRouter();
  const [openMenuIds, setOpenMenuIds] = useState<number[]>([]);
  const toggleMenu = (menuId: number) => {
    setOpenMenuIds(prevOpenMenuIds => {
      const isOpen = prevOpenMenuIds.includes(menuId);
      if (isOpen) {
        return prevOpenMenuIds.filter(id => id !== menuId);
      } else {
        return [...prevOpenMenuIds, menuId];
      }
    });
  };

  return (
    <div className={styles.menuComponent}>
      <ul>
        {pages.map(({ id, title, link, icon: Icon, children }) => {
          const isOpen = openMenuIds.includes(id);
          return (
            <li key={id}>
              <div className={styles.box}>
                <div
                  onClick={() => {
                    if (children) {
                      toggleMenu(id);
                    } else {
                      router.push(link);
                    }
                  }}
                  className={classNames(styles.text, {
                    [styles.active]: router.pathname === link,
                  })}
                >
                  <div className={styles.leftBlock}>
                    <Icon />
                    <div className={styles.title}> {title} </div>
                  </div>
                  {children && (
                    <div className={styles.arrowIcon}>{isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</div>
                  )}
                  <span className={styles.line} />
                </div>
              </div>
              {isOpen && children && (
                <ul>
                  {children.map(({ id: childId, title: childTitle, link: childLink, icon: ChildIcon }) => {
                    return (
                      <li key={childId}>
                        <div className={styles.childrenBox}>
                          <div
                            onClick={() => {
                              router.push(childLink);
                            }}
                            className={classNames(styles.text, {
                              [styles.active]: router.pathname === childLink,
                            })}
                          >
                            <div className={styles.leftBlock}>
                              <ChildIcon />
                              <div className={styles.title}> {childTitle} </div>
                            </div>
                            <span className={styles.line} />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
