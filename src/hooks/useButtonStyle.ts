import { BUTTON_STATE_COLORS } from '@/constants';
import { useMemo } from 'react';

const useButtonStyle = () => {
  return useMemo(() => {
    return (buttonState: string) => {
      const backgroundColor = (BUTTON_STATE_COLORS as Record<string, string>)[buttonState] || '';
      return {
        backgroundColor,
      };
    };
  }, []);
};

export default useButtonStyle;
