import { useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
  const lastCheck= useRef();

  useEffect(() => {
    lastCheck.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
        lastCheck.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}