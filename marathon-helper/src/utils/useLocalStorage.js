import { useState, useEffect } from "react";

/**
 * Stores a value in local storage and keeps it in sync with state.
 * @param {string} key The key under which the value is stored in local storage.
 * @param {*} defaultValue The default value to use if there is no value in local storage.
 * @returns {[any, function]} An array with the current value and a function to update it.
 */
export function useLocalStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
