import React from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Upload, Search, Sun, Moon, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient'; // Import Supabase so we can sign out
import './Nav.css';

// This is the navigation bar at the top of the page
// We receive theme and toggleTheme from App.jsx as props
function Nav(props) {
    
    // Function to handle logging out
    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <nav className="nav-bar">
            <div className="nav-inner">
                <div className="nav-brand">
                    <FolderOpen size={18} />
                    <span>Campus Vault</span>
                </div>

                <div className="nav-links">
                    {/* Link to the Home page */}
                    <Link to="/" className="nav-link">
                        <Upload size={15} />
                        Upload
                    </Link>
                    
                    {/* Link to the Browse page */}
                    <Link to="/browse" className="nav-link">
                        <Search size={15} />
                        Browse
                    </Link>

                    {/* Button to change the theme */}
                    <button
                        type="button"
                        className="theme-toggle-btn"
                        onClick={props.toggleTheme}
                        title="Toggle theme"
                    >
                        {/* We check which theme is active and show the right icon */}
                        {props.theme === 'dark' ? (
                            <Sun size={16} />
                        ) : (
                            <Moon size={16} />
                        )}
                    </button>

                    {/* Button to log out */}
                    <button
                        type="button"
                        className="btn-ghost"
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', fontSize: '14px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                    >
                        <LogOut size={15} />
                        Log Out
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Nav;