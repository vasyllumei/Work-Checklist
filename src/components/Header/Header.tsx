import BreadcrumbsItem, { Breadcrumbs } from './Breadcrumbs/Breadcrumbs';
import styles from '@/components/Header/Header.module.css';
import SearchBar from '@/components/Header/SearchBar/SearchBar';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FC } from 'react';
import { UserMenu } from '@/components/Header/UserMenu/UserMenu';
import { LanguageMenu } from '@/components/Header/LanguageMenu/LanguageMenu';

interface HeaderProps {
  breadcrumbData: BreadcrumbsItem[];
  searchText?: string | undefined;
  handleSearch?: ((text: string) => void) | undefined;
}

export const Header: FC<HeaderProps> = ({ breadcrumbData, searchText, handleSearch }) => {
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
          <LanguageMenu />
          <NightlightRoundIcon className={styles.moonIcon} />
          <InfoOutlinedIcon className={styles.infoIcon} />
          <UserMenu />
        </div>
      </div>
    </div>
  );
};
