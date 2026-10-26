import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Dropdown from '../common/Dropdown';

export function Header({ onMenuClick }) {
    const { user, profile, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const toast = useToast();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            toast.info('Signed out successfully');
        } catch (err) {
            toast.error('Logout error: ' + err.message);
        }
    };

    const userDropdownItems = [
        {
            id: 'profile',
            label: 'View My Profile',
            icon: 'person',
            onClick: () => navigate('/profile')
        },
        {
            id: 'dashboard',
            label: 'My Dashboard',
            icon: 'dashboard',
            onClick: () => navigate('/dashboard')
        },
        { divider: true },
        {
            id: 'theme',
            label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
            icon: theme === 'dark' ? 'light_mode' : 'dark_mode',
            onClick: toggleTheme
        },
        { divider: true },
        {
            id: 'logout',
            label: 'Sign Out',
            icon: 'logout',
            danger: true,
            onClick: handleLogout
        }
    ];

    const displayName = profile?.name || user?.user_metadata?.username || user?.email?.split('@')[0] || 'Student';

    return (
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-surface-container-lowest/90 backdrop-blur-xl z-30 border-b border-surface-variant transition-all">
            <div className="h-full w-full px-4 sm:px-8 flex items-center justify-between gap-4">
                {/* Left side: Hamburger button + Brand for mobile */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container lg:hidden cursor-pointer"
                        aria-label="Open sidebar"
                    >
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </button>
                    <div className="hidden sm:flex flex-col">
                        <span className="font-title-md text-sm font-semibold text-on-surface">Campus Academic Vault</span>
                        <span className="font-body-sm text-xs text-on-surface-variant">Central Repository for Study Materials</span>
                    </div>
                </div>

                {/* Right side: Actions & Profile */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        to="/upload"
                        className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-on-primary px-3 sm:px-4 py-2 rounded-full font-label-md text-xs sm:text-sm font-semibold shadow-sm transition-all"
                    >
                        <span className="material-symbols-outlined text-base">add</span>
                        <span className="hidden xs:inline">Upload Resource</span>
                    </Link>

                    {/* Theme Toggle Button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        aria-label="Toggle theme"
                    >
                        <span className="material-symbols-outlined text-xl">
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    {/* User profile dropdown trigger */}
                    <Dropdown
                        align="right"
                        trigger={
                            <div className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-full hover:bg-surface-container transition-colors">
                                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">
                                    {displayName[0].toUpperCase()}
                                </div>
                                <div className="hidden md:flex flex-col text-left">
                                    <span className="font-label-md text-xs font-semibold text-on-surface leading-tight">
                                        {displayName}
                                    </span>
                                    <span className="font-label-sm text-[10px] text-on-surface-variant">
                                        Verified Student
                                    </span>
                                </div>
                                <span className="material-symbols-outlined text-outline text-lg">
                                    keyboard_arrow_down
                                </span>
                            </div>
                        }
                        items={userDropdownItems}
                    />
                </div>
            </div>
        </header>
    );
}

export default Header;
