import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { LOCAL_STORAGE_TOKEN } from '@/constants';

const RouteGuard = ({ children }) => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = Cookies.get(LOCAL_STORAGE_TOKEN);
      if (token && isTokenValid(token)) {
        setAuthenticated(true);
      } else if (!router.pathname.startsWith('/login')) {
        setAuthenticated(false);
        router.push('/login');
      }
    };

    const isTokenValid = token => {
      try {
        const parsedToken = JSON.parse(atob(token.split('.')[1]));
        const isTokenExpired = parsedToken.exp * 1000 < Date.now();
        return !isTokenExpired;
      } catch (error) {
        console.error('Error parsing token:', error);
        return false;
      }
    };

    const handleRouteChangeStart = url => {
      console.log('Route change started:', url);
      if (!url.startsWith('/login')) {
        checkAuthentication();
      }
    };

    checkAuthentication();

    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router]);

  return authenticated ? <>{children}</> : null;
};

export default RouteGuard;
