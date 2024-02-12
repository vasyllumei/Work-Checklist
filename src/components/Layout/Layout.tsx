import { FC, ReactNode } from 'react';
import Head from 'next/head';
import { StyledLayout } from '@/components/Layout/LayoutStyles';
import { Menu } from '@/components/Menu/Menu';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { KanbanProvider } from '@/components/Kanban/providers/kanbanProvider';

interface Breadcrumb {
  title: string;
  link: string;
}
interface LayoutProps {
  children: ReactNode;
  headTitle?: string;
  breadcrumbs?: Breadcrumb[];
}

export const Layout: FC<LayoutProps> = ({ children, headTitle, breadcrumbs }) => {
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
          <KanbanProvider>
            <Header breadcrumbData={breadcrumbs} />
          </KanbanProvider>
        )}
        {children}
        <Footer />
      </StyledLayout.Content>
    </StyledLayout.Container>
  );
};
