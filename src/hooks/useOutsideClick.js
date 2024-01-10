import { useEffect } from 'react';

const useOutsideClick = (callback, containerRef, excludeRefs = []) => {
  useEffect(() => {
    const handleClick = event => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !excludeRefs.some(ref => ref.current && ref.current.contains(event.target))
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
