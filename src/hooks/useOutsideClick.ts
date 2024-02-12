import { useEffect, RefObject } from 'react';

type Callback = () => void;

const useOutsideClick = (
  callback: Callback,
  containerRef: RefObject<HTMLElement>,
  excludeRefs: RefObject<HTMLElement>[] = [],
): void => {
  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !excludeRefs.some(ref => ref.current && ref.current.contains(event.target as Node))
      ) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [containerRef, excludeRefs, callback]);
};

export default useOutsideClick;
