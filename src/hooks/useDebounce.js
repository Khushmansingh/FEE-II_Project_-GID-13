import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce values (e.g. search inputs)
 * Prevents rapid unnecessary re-renders or API calls while typing
 * @param {any} value 
 * @param {number} delayMs 
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delayMs = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delayMs);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delayMs]);

    return debouncedValue;
}
