import classNames from 'classnames';
import React, { FC } from 'react';
import styles from './Menu.module.css';
import { useRouter } from 'next/router';
import DashboardIcon from '../../assets/image/menuicon/dashboardicon.svg';
import MarketPlaceIcon from '../../assets/image/menuicon/marketplaceIcon.svg';
import TablesIcon from '../../assets/image/menuicon/tablesIcon.svg';
import KanbanIcon from '../../assets/image/menuicon/kanbasicon.svg';
import ProfileIcon from '../../assets/image/menuicon/prifoleicon.svg';
import SignInIcon from '../../assets/image/menuicon/signinicon.svg';

const pages = [
  { id: 1, title: 'Dashboard', link: '/', disabled: false, icon: DashboardIcon },
  { id: 2, title: 'NFT Marketplace', link: '/users', disabled: false, icon: MarketPlaceIcon },
  { id: 3, title: 'Tables', link: '/tables', disabled: false, icon: TablesIcon },
  { id: 4, title: 'Kanban', link: '/kanban', disabled: false, icon: KanbanIcon },
  { id: 5, title: 'Profile', link: '/profile', disabled: false, icon: ProfileIcon },
  { id: 6, title: 'Sign In', link: '/signin', disabled: false, icon: SignInIcon },
];

export const Menu: FC = () => {
  const router = useRouter();

  return (
    <div className={styles.menuComponent}>
      <ul>
        {pages.map(({ id, title, link, icon: Icon }) => {
          return (
            <li key={id}>
              <div className={styles.box}>
                <div
                  onClick={() => {
                    router.push(link);
                  }}
                  className={classNames(styles.text, {
                    [styles.active]: router.pathname === link,
                  })}
                >
                  <div className={styles.leftBlock}>
                    <Icon />
                    <div className={styles.title}> {title} </div>
                  </div>
                  <span className={styles.line} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
