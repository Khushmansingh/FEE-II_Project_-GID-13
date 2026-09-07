import React from 'react';
import { NavLink } from 'react-router-dom';
import { FolderOpen, Upload, Search, User } from 'lucide-react';
import './Nav.css';

const Nav = () => {
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
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                    >
                        <User size={15} aria-hidden="true" />
                        Profile
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Nav;