import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

export const useHandleInteraction = () => {
  const router = useRouter();
  const [updates, setUpdates] = useState<Record<string, string | undefined | number>>({});
  const prevUpdates = useRef(updates);

  useEffect(() => {
    if (JSON.stringify(prevUpdates.current) !== JSON.stringify(updates)) {
      const queryParams = new URLSearchParams(router.asPath.split('?')[1] || '');
      const existingParams: Record<string, string> = {};

      queryParams.forEach((value, key) => {
        existingParams[key] = value;
      });

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== null && value !== '' && value !== undefined) {
          if (key === 'limit' && value === 5) {
            queryParams.delete(key);
          } else if (key === 'skip' && value === 0) {
            queryParams.delete(key);
          } else if (existingParams[key] !== String(value)) {
            queryParams.set(key, String(value));
          }
        } else {
          queryParams.delete(key);
        }
      });

      const updatedRoute = `${router.pathname}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      router.replace(updatedRoute);

      prevUpdates.current = updates;
    }
  }, [updates, router]);

  return setUpdates;
};
