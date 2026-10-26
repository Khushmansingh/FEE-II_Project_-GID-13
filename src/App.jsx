import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Browse from './Browse';
import ResourceDetail from './components/ResourceDetail';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import Auth from './Auth';
import UpdatePassword from './UpdatePassword';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

function AppContent() {
    const { session, loading, isRecoveringPassword, setIsRecoveringPassword } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <LoadingSpinner fullPage message="Connecting to Campus Vault..." />
            </div>
        );
    }

    if (isRecoveringPassword) {
        return (
            <UpdatePassword
                onComplete={() => {
                    setIsRecoveringPassword(false);
                    window.history.replaceState(null, '', window.location.pathname);
                }}
            />
        );
    }

    if (!session) {
        return <Auth />;
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Nested layout routes */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="browse" element={<Browse />} />
                    <Route path="upload" element={<Home />} />
                    {/* Dynamic route for single note details */}
                    <Route path="notes/:id" element={<ResourceDetail />} />
                    {/* Student academic profile */}
                    <Route path="profile" element={<Profile />} />
                    {/* 404 Catch-All Page */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default App;