import React from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Upload, Search, Sun, Moon, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';
import './Nav.css';

function Nav(props) {
    async function handleLogout() {
        await supabase.auth.signOut();
    }
    return (
        <nav className="nav-bar">
            <div className="nav-inner">
                <div className="nav-brand">
                    <FolderOpen size={20} strokeWidth={2.5} />
                    <span>Campus Vault</span>
                </div>
                <div className="nav-links">
                    <Link to="/" className="nav-link">
                        <Upload size={16} />
                        Upload
                    </Link>
                    <Link to="/browse" className="nav-link">
                        <Search size={16} />
                        Browse
                    </Link>
                    <button
                        type="button"
                        className="theme-toggle-btn"
                        onClick={props.toggleTheme}
                        title="Toggle theme"
                    >
                        {props.theme === 'dark' ? (
                            <Sun size={18} />
                        ) : (
                            <Moon size={18} />
                        )}
                    </button>
                    <button
                        type="button"
                        className="btn-ghost btn-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        Log Out
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Nav;