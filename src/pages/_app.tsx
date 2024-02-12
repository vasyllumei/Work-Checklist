import type { AppProps } from 'next/app';
import theme from '@/styles/theme';
import { ThemeProvider } from '@mui/system';
import React from 'react';
import { CssBaseline } from '@mui/material';
import RouteGuard from '@/components/AuthenticatedRoute/AuthenticatedRoute';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouteGuard>
        <Component {...pageProps} />
      </RouteGuard>
    </ThemeProvider>
  );
}
