import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { LOCAL_STORAGE_TOKEN } from '@/constants';

interface RouteGuardProps {
  children: ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  const isPublicRoute = (path: string): boolean => {
    const publicRoutes = ['/login', '/signUp', '/'];
    return publicRoutes.includes(path);
  };

  const checkAuthentication = (): void => {
    const token = Cookies.get(LOCAL_STORAGE_TOKEN);
    if (token && isTokenValid(token)) {
      setAuthenticated(true);
    } else if (!isPublicRoute(router.pathname)) {
      setAuthenticated(false);
      router.push('/login');
    }
  };

  const isTokenValid = (token: string): boolean => {
    try {
      const tokenData = token.split('.')[1];
      if (!tokenData) {
        return false;
      }
      const parsedToken = JSON.parse(atob(tokenData));
      const isTokenExpired = parsedToken.exp * 1000 < Date.now();
      return !isTokenExpired;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  };

  const handleRouteChangeStart = (url: string): void => {
    if (!isPublicRoute(url)) {
      checkAuthentication();
    }
  };

  useEffect(() => {
    checkAuthentication();

    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router.pathname]);

  return authenticated || isPublicRoute(router.pathname) ? <>{children}</> : null;
};

export default RouteGuard;
