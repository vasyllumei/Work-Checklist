import Breadcrumb, { BreadcrumbsPath } from '././Breadcrumbs/BreadcrumbsPath';
import styles from '@/components/Header/Header.module.css';
import SearchBar from '@/components/Header/SearchBar/SearchBar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FC } from 'react';
import { UserMenu } from '@/components/Header/UserMenu/UserMenu';

interface HeaderProps {
  breadcrumbData: Breadcrumb[];
  searchText: string;
  handleSearch: (text: string) => void;
}

export const Header: FC<HeaderProps> = ({ breadcrumbData, searchText, handleSearch }) => {
  const currentPage = breadcrumbData[breadcrumbData.length - 1];

  return (
    <div className={styles.titleContent}>
      <h1 className={styles.title}>
        <BreadcrumbsPath breadcrumbData={breadcrumbData} />
        {currentPage ? currentPage.title : ''}
      </h1>
      <div className={styles.misc}>
        <div className={styles.search}>
          <SearchBar searchText={searchText} handleSearch={handleSearch} />
        </div>

        <div className={styles.actionsMenu}>
          <NotificationsNoneIcon className={styles.notificationIcon} />
          <NightlightRoundIcon className={styles.moonIcon} />
          <InfoOutlinedIcon className={styles.infoIcon} />
          <UserMenu />
        </div>
      </div>
    </div>
  );
};
