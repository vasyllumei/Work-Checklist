import BreadcrumbsComponent from '@/components/Header/Breadcrumbs/BreadcrumbsPath';
import styles from '@/components/Header/Header.module.css';
import SearchBar from '@/components/Header/SearchBar/SearchBar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FC } from 'react';
import DropDown from '@/components/Header/DropDown/DropDown';

interface Breadcrumb {
  title: string;
  link: string;
}

interface HeaderProps {
  breadcrumbData: Breadcrumb[];
}

export const Header: FC<HeaderProps> = ({ breadcrumbData }) => {
  const currentPage = breadcrumbData[breadcrumbData.length - 1];

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
          <div className={styles.headerAvatar}>
            <DropDown />
          </div>
        </div>
      </div>
    </div>
  );
};
