import { FC } from 'react';
import { useRouter } from 'next/router';
import styles from '@/components/Header/Header.module.css';
import BreadcrumbsComponent from '@/components/Header/Breadcrumbs/Breadcrumbs';
import { pages } from './../Menu/Menu';
import SearchBar from '@/components/Header/SearchBar/SearchBar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const Header: FC = () => {
  const router = useRouter();
  const currentPage = pages.find(page => page.link === router.pathname);
  const breadcrumbData =
    router.pathname === '/'
      ? [{ title: 'Dashboard', link: '/' }]
      : [{ title: 'Dashboard', link: '/' }, currentPage || { title: '', link: '' }];

  return (
    <div className={styles.titleContent}>
      <h1 className={styles.title}>
        <BreadcrumbsComponent breadcrumbData={breadcrumbData} />
        {currentPage ? currentPage.title : ''}
      </h1>
      <div className={styles.misc}>
        <div className={styles.search}>
          <SearchBar />
        </div>

        <div className={styles.actionsMenu}>
          <NotificationsNoneIcon className={styles.notificationIcon} />
          <NightlightRoundIcon className={styles.moonIcon} />
          <InfoOutlinedIcon className={styles.infoIcon} />
          <img className={styles.headerAvatar} src="/headerAvatar.png" alt="Header Avatar" />
        </div>
      </div>
    </div>
  );
};
