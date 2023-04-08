import { FC, ReactNode } from 'react';
import { StyledAuthBaseTemplate } from '@/components/pages/auth/components/AuthBaseTemplate/AuthBaseTemplateStyles';
import Head from 'next/head';
import { Stack } from '@mui/material';

interface AuthBaseTemplateProps {
  children: ReactNode;
  headTitle?: string;
}

export const AuthBaseTemplate: FC<AuthBaseTemplateProps> = ({ children, headTitle }) => (
  <StyledAuthBaseTemplate.Container>
    <Head>
      <title>{headTitle}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    </Head>
    <StyledAuthBaseTemplate.Left>
      <Stack alignItems="center" justifyContent="center" height="100%" width="410px">
        {children}
      </Stack>
    </StyledAuthBaseTemplate.Left>
    <StyledAuthBaseTemplate.Right></StyledAuthBaseTemplate.Right>
  </StyledAuthBaseTemplate.Container>
);
