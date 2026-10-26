import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { profileService } from '../api/profileService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRecoveringPassword, setIsRecoveringPassword] = useState(() => {
        return typeof window !== 'undefined' && window.location.hash.includes('type=recovery');
    });

    // Helper to refresh profile
    const refreshProfile = useCallback(async (currentUser) => {
        const u = currentUser || user;
        if (u?.email) {
            try {
                const p = await profileService.getProfile(u.email);
                setProfile(p);
            } catch (err) {
                console.warn('Could not load profile in AuthContext:', err);
            }
        }
    }, [user]);

    useEffect(() => {
        let mounted = true;

        async function initAuth() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (mounted) {
                    setSession(session);
                    setUser(session?.user || null);
                    if (session?.user?.email) {
                        const p = await profileService.getProfile(session.user.email);
                        if (mounted) setProfile(p);
                    }
                }
            } catch (err) {
                console.error('Error fetching initial session:', err);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsRecoveringPassword(true);
            }
            if (mounted) {
                setSession(newSession);
                setUser(newSession?.user || null);
                if (newSession?.user?.email) {
                    const p = await profileService.getProfile(newSession.user.email);
                    if (mounted) setProfile(p);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const signUp = async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setSession(null);
        setUser(null);
        setProfile(null);
    };

    const resetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        if (error) throw error;
        return true;
    };

    const updatePassword = async (newPassword) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        return true;
    };

    const value = useMemo(() => ({
        session,
        user,
        profile,
        loading,
        isRecoveringPassword,
        setIsRecoveringPassword,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile
    }), [session, user, profile, loading, isRecoveringPassword, refreshProfile]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
