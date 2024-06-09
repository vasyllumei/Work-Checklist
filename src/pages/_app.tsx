import type { AppProps } from 'next/app';
import theme from '@/styles/theme';
import { ThemeProvider } from '@mui/system';
import React from 'react';
import { CssBaseline } from '@mui/material';
import RouteGuard from '@/components/AuthenticatedRoute/AuthenticatedRoute';
import { Provider } from 'react-redux';
import '../utils/languageSetup';
import store from '@/store/projectStore/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline />
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </Provider>{' '}
    </ThemeProvider>
  );
}
