import type { AppProps } from 'next/app';
import theme from '@/styles/theme';
import { ThemeProvider } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material';
import RouteGuard from '@/components/AuthenticatedRoute/AuthenticatedRoute';
import { Provider } from 'react-redux';
import '../utils/languageSetup';
import store from '@/store/projectStore/store';
import Loader from '@/components/Loader/Loader';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline />
        {loading && <Loader />}
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </Provider>
    </ThemeProvider>
  );
}
