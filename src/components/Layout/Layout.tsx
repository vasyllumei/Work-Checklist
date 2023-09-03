import { FC, ReactNode } from 'react';
import Head from 'next/head';
import { StyledLayout } from '@/components/Layout/LayoutStyles';
import { Menu, pages } from '@/components/Menu/Menu';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { useRouter } from 'next/router';

interface Breadcrumb {
  title: string;
  link: string;
}
interface LayoutProps {
  children: ReactNode;
  headTitle?: string;
  breadcrumbs?: Breadcrumb[];
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
}

export const Layout: FC<LayoutProps> = ({ children, headTitle, breadcrumbs, searchText, handleSearch }) => {
  const router = useRouter();
  const currentPage = pages.find(page => page.link === router.pathname);
  const pageTitle = headTitle || currentPage?.title;

  return (
    <StyledLayout.Container>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <StyledLayout.Menu>
        <Menu />
      </StyledLayout.Menu>

      <StyledLayout.Content>
        {breadcrumbs && <Header searchText={searchText} handleSearch={handleSearch} breadcrumbData={breadcrumbs} />}
        {children}
        <Footer />
      </StyledLayout.Content>
    </StyledLayout.Container>
  );
};
