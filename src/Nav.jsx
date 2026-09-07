import React from 'react';
import { NavLink } from 'react-router-dom';
import { FolderOpen, Upload, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import './Nav.css';

const Nav = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="nav-bar">
            <div className="nav-inner">
                <div className="nav-brand">
                    <FolderOpen size={18} aria-hidden="true" />
                    <span>Campus Vault</span>
                </div>

                <div className="nav-links">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                    >
                        <Upload size={15} aria-hidden="true" />
                        Upload
                    </NavLink>
                    <NavLink
                        to="/browse"
                        className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                    >
                        <Search size={15} aria-hidden="true" />
                        Browse
                    </NavLink>

                    <button
                        type="button"
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? (
                            <Sun size={16} aria-hidden="true" />
                        ) : (
                            <Moon size={16} aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Nav;