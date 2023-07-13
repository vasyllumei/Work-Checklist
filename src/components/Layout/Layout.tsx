import { FC, ReactNode } from 'react';
import Head from 'next/head';
import { StyledLayout } from '@/components/Layout/LayoutStyles';
import { Menu } from '@/components/Menu/Menu';

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
        <Menu />{' '}
      </StyledLayout.Menu>
      <StyledLayout.Content>{children}</StyledLayout.Content>
    </StyledLayout.Container>
  );
};
