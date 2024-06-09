import { useEffect, useState } from 'react';
import { UserType } from '@/types/User';

export const useUserDisplayDataMap = (users: UserType[]) => {
  const [userDisplayDataMap, setUserDisplayDataMap] = useState<
    Map<string, { initials: string; backgroundColor: string }>
  >(new Map());

  useEffect(() => {
    const map = new Map();
    users.forEach((user: UserType) => {
      const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;
      const backgroundColor = user.iconColor ?? 'blue';
      map.set(user.id, { initials, backgroundColor });
    });
    setUserDisplayDataMap(map);
  }, [users]);

  return userDisplayDataMap;
};
