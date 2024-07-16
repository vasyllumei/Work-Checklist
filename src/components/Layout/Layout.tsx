import React, { FC, ReactNode } from 'react';
import Head from 'next/head';
import styles from './Layout.module.css';
import { Menu } from '@/components/Menu/Menu';
import { Header } from '@/components/Header/Header';
import SideBarIcon from '@/assets/image/menuicon/sidebarIcon.svg';
import CloseIcon from '../../assets/image/menuicon/closeIcon.svg';
import { useDialogControl } from '@/hooks/useDialogControl';

interface Breadcrumb {
  title: string;
  link: string;
}

interface LayoutProps {
  children: ReactNode;
  headTitle?: string;
  breadcrumbs?: Breadcrumb[];
  searchText?: string;
  handleSearch?: (text: string) => void;
}

export const Layout: FC<LayoutProps> = ({ children, headTitle, breadcrumbs, searchText, handleSearch }) => {
  const { isOpen: isMenuOpen, openDialog: openMenu, closeDialog: closeMenu } = useDialogControl();

  return (
    <div className={styles.container}>
      <Head>
        <title>{headTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <nav className={`${styles.menu} ${isMenuOpen ? styles.visible : styles.hidden}`}>
        <button className={styles.closeIcon} onClick={closeMenu}>
          <CloseIcon />
        </button>
        <Menu />
      </nav>

      <main className={styles.content}>
        <header>
          {!isMenuOpen && (
            <button className={styles.sidebarIcon} onClick={openMenu}>
              <SideBarIcon />
            </button>
          )}
          {breadcrumbs && <Header searchText={searchText} handleSearch={handleSearch} breadcrumbData={breadcrumbs} />}
        </header>

        {children}
      </main>
    </div>
  );
};
