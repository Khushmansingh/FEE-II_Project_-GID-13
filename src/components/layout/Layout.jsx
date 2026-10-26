import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
            {/* Sidebar navigation */}
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
            />

            {/* Main content wrapper */}
            <div className="lg:pl-72 flex flex-col min-h-screen">
                <Header 
                    onMenuClick={() => setSidebarOpen(true)} 
                />

                <main className="flex-1 w-full pt-24 px-4 sm:px-8 py-6 max-w-7xl mx-auto">
                    <Outlet />
                </main>

                <footer className="py-6 px-4 sm:px-8 border-t border-surface-container text-center text-xs text-outline">
                    Campus Vault · FEE-II Project (GID-13) · Chitkara University
                </footer>
            </div>
        </div>
    );
}

export default Layout;
