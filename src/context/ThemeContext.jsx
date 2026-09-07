import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

const THEME_KEY = 'campus-vault-theme';
const FONT_KEY = 'campus-vault-font';

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem(THEME_KEY) || 'dark';
        } catch {
            return 'dark';
        }
    });

    const [font, setFont] = useState(() => {
        try {
            return localStorage.getItem(FONT_KEY) || 'default';
        } catch {
            return 'default';
        }
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem(THEME_KEY, theme); } catch { /* noop */ }
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-font', font);
        try { localStorage.setItem(FONT_KEY, font); } catch { /* noop */ }
    }, [font]);

    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, font, setFont }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};

export default ThemeContext;
