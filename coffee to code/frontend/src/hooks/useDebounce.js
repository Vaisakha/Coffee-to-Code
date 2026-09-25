import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value changes (e.g. search inputs)
 * @param {*} value - Value to debounce
 * @param {number} delayMs - Delay duration in milliseconds (defaults to 300ms)
 */
export const useDebounce = (value, delayMs = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
};

export default useDebounce;
