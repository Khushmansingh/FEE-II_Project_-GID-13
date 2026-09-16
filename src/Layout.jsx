import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';

function Layout({ children, toggleTheme, theme }) {
    const location = useLocation();
    const [userName, setUserName] = useState('');
    const [profilePic, setProfilePic] = useState('https://lh3.googleusercontent.com/a/ACg8ocLwVpE8_BwB0E_Q8yT9i_O_R_h-K_O-_C-x_X_M_Y_Y=s96-c');

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata?.username || user.email.split('@')[0]);
                // If user has metadata picture, set it here.
                if (user.user_metadata?.avatar_url) {
                    setProfilePic(user.user_metadata.avatar_url);
                }
            }
        }
        fetchUser();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const linkClasses = (path) => {
        const base = "flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-all group ";
        if (isActive(path)) {
            return base + "bg-primary-container text-on-primary font-title-md shadow-sm";
        }
        return base + "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface";
    };

    const iconClasses = (path) => {
        if (isActive(path)) {
            return "material-symbols-outlined text-outline group-hover:text-on-surface transition-colors";
        }
        return "material-symbols-outlined text-outline group-hover:text-on-surface transition-colors";
    };

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
            <aside className="fixed left-0 top-0 bottom-0 w-72 bg-surface-container-lowest z-40 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col">
                    <div className="h-20 px-space-lg flex items-center justify-between">
                        <div className="flex items-center gap-space-sm">
                            <span className="material-symbols-outlined text-primary text-3xl">folder_open</span>
                            <div className="flex flex-col">
                                <span className="font-title-md text-title-md text-on-surface leading-tight tracking-tight">Campus Vault</span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Student Notes</span>
                            </div>
                        </div>
                        <span className="px-space-xs py-0.5 bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm rounded-full">PRO</span>
                    </div>
                    <div className="px-space-lg py-space-sm">
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Workspace</span>
                    </div>
                    <nav className="flex flex-col gap-1 px-space-md">
                        <Link to="/dashboard" className={linkClasses('/dashboard')}>
                            <span className={iconClasses('/dashboard')}>space_dashboard</span>
                            <span className="font-label-md text-label-md">Dashboard</span>
                        </Link>
                        <Link to="/browse" className={linkClasses('/browse')}>
                            <span className={iconClasses('/browse')}>search</span>
                            <span className="font-label-md text-label-md">Browse Notes</span>
                        </Link>
                        <Link to="/" className={linkClasses('/')}>
                            <span className={iconClasses('/')}>upload_file</span>
                            <span className="font-label-md text-label-md">Upload Resource</span>
                        </Link>
                    </nav>
                </div>
                
                <div className="p-space-md m-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-sm">
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors font-label-md">
                        <span className="material-symbols-outlined text-xl">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>
            
            <div className="pl-72 flex flex-col min-h-screen">
                <header className="fixed top-0 left-72 right-0 h-20 bg-surface-container-lowest/90 backdrop-blur-xl z-30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                    <div className="h-20 w-full px-space-xl flex items-center justify-end gap-space-lg">
                        <div className="flex items-center gap-space-md">
                            <Link to="/" className="flex items-center gap-1.5 bg-primary-container hover:bg-primary text-on-primary px-space-md py-2 rounded-full font-label-md text-label-md transition-all shadow-sm">
                                <span className="material-symbols-outlined text-base">add</span>
                                <span>Upload Resource</span>
                            </Link>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                            >
                                <span className="material-symbols-outlined">
                                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                </span>
                            </button>
                            <div className="flex items-center gap-space-sm pl-space-sm cursor-pointer">
                                <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src={profilePic}/>
                                <div className="hidden xl:flex flex-col text-left">
                                    <span className="font-label-md text-label-md font-semibold text-on-surface leading-tight">{userName || 'Student'}</span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Active Scholar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                
                <main className="flex-1 w-full pt-20 px-space-xl py-space-lg bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;
