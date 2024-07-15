import BreadcrumbsItem, { Breadcrumbs } from './Breadcrumbs/Breadcrumbs';
import styles from '@/components/Header/Header.module.css';
import SearchBar from '@/components/Header/SearchBar/SearchBar';
import { FC } from 'react';
import { UserMenu } from '@/components/Header/UserMenu/UserMenu';
import { LanguageMenu } from '@/components/LanguageMenu/LanguageMenu';

interface HeaderProps {
  breadcrumbData: BreadcrumbsItem[];
  searchText?: string | undefined;
  handleSearch?: ((text: string) => void) | undefined;
}

export const Header: FC<HeaderProps> = ({ breadcrumbData, searchText, handleSearch }) => {
  const currentPage = breadcrumbData[breadcrumbData.length - 1];
  return (
    <header className={styles.header}>
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
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
