import { FC, ReactNode } from 'react';
import Head from 'next/head';
import { StyledLayout } from '@/components/Layout/LayoutStyles';
import { Menu } from '@/components/Menu/Menu';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { UserType } from '@/types/User';

interface Breadcrumb {
  title: string;
  link: string;
}
interface LayoutProps {
  children: ReactNode;
  headTitle?: string;
  breadcrumbs?: Breadcrumb[];
  searchText?: string | undefined;
  setSearchText?: (text: string) => void;
  users?: UserType[];
}

export const Layout: FC<LayoutProps> = ({ children, headTitle, breadcrumbs, searchText, setSearchText, users }) => {
  const handleSearch = (text: string) => {
    setSearchText && setSearchText(text);
  };
  return (
    <StyledLayout.Container>
      <Head>
        <title>{headTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <StyledLayout.Menu>
        <Menu />
      </StyledLayout.Menu>

      <StyledLayout.Content>
        {breadcrumbs && (
          <Header searchText={searchText} handleSearch={handleSearch} breadcrumbData={breadcrumbs} users={users} />
        )}
        {children}
        <Footer />
      </StyledLayout.Content>
    </StyledLayout.Container>
  );
};
