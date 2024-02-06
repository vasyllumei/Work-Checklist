import BreadcrumbsItem, { Breadcrumbs } from './Breadcrumbs/Breadcrumbs';
import styles from '@/components/Header/Header.module.css';
import SearchBar from '@/components/Header/SearchBar/SearchBar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FC } from 'react';
import { UserMenu } from '@/components/Header/UserMenu/UserMenu';
import { UserType } from '@/types/User';

interface HeaderProps {
  breadcrumbData: BreadcrumbsItem[];
  searchText?: string | undefined;
  handleSearch: (text: string) => void;
  users?: UserType[];
}

export const Header: FC<HeaderProps> = ({ breadcrumbData, searchText, handleSearch, users }) => {
  const currentPage = breadcrumbData[breadcrumbData.length - 1];

  return (
    <div className={styles.titleContent}>
      <h1 className={styles.title}>
        <Breadcrumbs data={breadcrumbData} />
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
          <UserMenu users={users} />
        </div>
      </div>
    </div>
  );
};
