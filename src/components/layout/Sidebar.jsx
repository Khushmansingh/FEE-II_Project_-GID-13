import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function Sidebar({ isOpen, onClose }) {
    const { user, profile, signOut } = useAuth();
    const toast = useToast();

    const handleLogout = async () => {
        try {
            await signOut();
            toast.info('Signed out successfully');
        } catch (err) {
            toast.error('Logout error: ' + err.message);
        }
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'space_dashboard' },
        { path: '/browse', label: 'Browse Notes', icon: 'search' },
        { path: '/upload', label: 'Upload Resource', icon: 'upload_file' },
        { path: '/profile', label: 'My Profile', icon: 'account_circle' },
    ];

    const getLinkClasses = ({ isActive }) => {
        const base = "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-label-md text-sm select-none ";
        if (isActive) {
            return base + "bg-primary-container text-on-primary font-semibold shadow-sm";
        }
        return base + "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface";
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside 
                className={`fixed left-0 top-0 bottom-0 w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-md transition-transform duration-300 ease-in-out border-r border-surface-variant ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex flex-col">
                    {/* Header */}
                    <div className="h-20 px-6 flex items-center justify-between border-b border-surface-container">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-fixed/50 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-2xl">folder_open</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-title-md text-base font-bold text-on-surface leading-tight tracking-tight">
                                    Campus Vault
                                </span>
                                <span className="font-label-sm text-xs text-on-surface-variant font-medium">
                                    Academic Sharing
                                </span>
                            </div>
                        </div>

                        {/* Mobile close button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-outline hover:text-on-surface lg:hidden"
                            aria-label="Close menu"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>

                    {/* Section Label */}
                    <div className="px-6 pt-5 pb-2">
                        <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
                            Workspace
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-1.5 px-4" aria-label="Main Navigation">
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                onClick={() => onClose?.()}
                                className={getLinkClasses}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Bottom User summary and Logout */}
                <div className="p-4 m-4 bg-surface-container-low rounded-2xl flex flex-col gap-3 border border-surface-container">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                            {(profile?.name || user?.user_metadata?.username || user?.email || 'U')[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-label-md text-xs font-semibold text-on-surface truncate">
                                {profile?.name || user?.user_metadata?.username || user?.email?.split('@')[0]}
                            </span>
                            <span className="font-label-sm text-[11px] text-outline truncate">
                                {user?.email}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full py-2 text-error hover:bg-error-container hover:text-on-error-container rounded-xl transition-colors font-label-md text-xs font-semibold cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">logout</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
