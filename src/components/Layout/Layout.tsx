import { FC, ReactNode } from 'react';
import Head from 'next/head';
import { StyledLayout } from '@/components/Layout/LayoutStyles';
import { Menu } from '@/components/Menu/Menu';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

interface LayoutProps {
  children: ReactNode;
  headTitle?: string;
}

export const Layout: FC<LayoutProps> = ({ children, headTitle }) => {
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
        <Header />
        {children}
        <Footer />
      </StyledLayout.Content>
    </StyledLayout.Container>
  );
};
