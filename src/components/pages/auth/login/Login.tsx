import { AuthBaseTemplate } from '@/components/pages/auth/components/AuthBaseTemplate';
import { Stack, Typography } from '@mui/material';
import { FC } from 'react';

export const Login: FC = () => {
  return (
    <AuthBaseTemplate headTitle="Portal | Login">
      <Stack justifyContent="start">
        <Typography variant="h4">Sign In</Typography>
        <Typography variant="subtitle1">Enter your email and password to sign in!</Typography>
      </Stack>
    </AuthBaseTemplate>
  );
};
