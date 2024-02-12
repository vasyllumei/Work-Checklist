import { FC, ReactNode } from 'react';
import Head from 'next/head';
import { StyledLayout } from '@/components/Layout/LayoutStyles';
import { Menu } from '@/components/Menu/Menu';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { KanbanProvider } from '@/components/Kanban/providers/kanbanProvider';
import { UserType } from '@/types/User';

interface Breadcrumb {
  title: string;
  link: string;
}
interface LayoutProps {
  children: ReactNode;
  headTitle?: string;
  breadcrumbs?: Breadcrumb[];
  users: UserType[];
}

export const Layout: FC<LayoutProps> = ({ children, users, headTitle, breadcrumbs }) => {
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
            <Header breadcrumbData={breadcrumbs} users={users} />
          </KanbanProvider>
        )}
        {children}
        <Footer />
      </StyledLayout.Content>
    </StyledLayout.Container>
  );
};
