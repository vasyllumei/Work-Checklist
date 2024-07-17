import classNames from 'classnames';
import React, { FC } from 'react';
import styles from './Menu.module.css';
import { useRouter } from 'next/router';
import DashboardIcon from '../../assets/image/menuicon/dashboardicon.svg';
import BacklogIcon from '../../assets/image/menuicon/backlog.svg';
import KanbanIcon from '../../assets/image/menuicon/kanbasicon.svg';
import BoardConfigs from '../../assets/image/menuicon/boardsConfigs.svg';
import ProfileIcon from '../../assets/image/menuicon/prifoleicon.svg';
import SettingIcon from '../../assets/image/menuicon/settingicon.svg';
import { ProjectsList } from 'src/components/ProjectList';

const pages = [
  { id: 1, title: 'Dashboard', link: '/', disabled: false, icon: DashboardIcon },
  { id: 2, title: 'Users', link: '/users', disabled: false, icon: ProfileIcon },
  { id: 3, title: 'Backlog', link: '/backlog', disabled: false, icon: BacklogIcon },
  { id: 4, title: 'Kanban', link: '/kanban', disabled: false, icon: KanbanIcon },
  {
    id: 5,
    title: 'Configs',
    link: '/configs',
    disabled: false,
    icon: BoardConfigs,
  },
  { id: 6, title: 'Setting', link: '/menulist', disabled: false, icon: SettingIcon },
];

export const Menu: FC = () => {
  const router = useRouter();
  const handleNavigation = (link: string) => {
    router.push(link);
  };

  return (
    <div className={styles.menuComponent}>
      <ul className={styles.listContainer}>
        {pages.map(({ id, title, link, icon: Icon }) => {
          return (
            <li key={id}>
              <div className={styles.box}>
                <div
                  onClick={() => {
                    handleNavigation(link);
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
      {(router.pathname.includes('kanban') || router.pathname.includes('backlog')) && <ProjectsList />}
    </div>
  );
};
