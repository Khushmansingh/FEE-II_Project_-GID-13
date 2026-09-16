import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function Auth() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ 
                    email, 
                    password,
                    options: {
                        data: {
                            username: username
                        }
                    }
                });
                if (error) throw error;
                alert('Check your email for the login link or you might be logged in automatically!');
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleForgotPassword() {
        if (!email) {
            alert('Please enter your email address above first to reset your password.');
            return;
        }
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
            });
            if (error) throw error;
            alert('Password reset link sent! Check your email.');
        } catch (error) {
            alert('Error resetting password: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center">
            <main className="w-full flex-1 flex flex-col items-center justify-center p-space-md">
                <div className="flex flex-col w-full items-center justify-center relative py-space-xl px-gutter-mobile md:px-gutter min-h-full">
                    {/* Ambient glow orbs */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-primary-fixed-dim/35 rounded-full blur-3xl pointer-events-none -z-10"></div>
                    <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-secondary-fixed-dim/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
                    <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-surface-variant/40 rounded-full blur-2xl pointer-events-none -z-10"></div>

                    <div className="w-full max-w-[460px] flex flex-col items-center">
                        {/* Brand header */}
                        <div className="flex flex-col items-center text-center mb-space-lg space-y-space-sm">
                            <div className="relative group">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-primary-container p-0.5 shadow-md shadow-primary/20 flex items-center justify-center transition-transform hover:scale-105 duration-200">
                                    <div className="w-full h-full bg-surface-container-lowest rounded-[14px] flex items-center justify-center overflow-hidden">
                                        <span className="material-symbols-outlined text-primary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>school</span>
                                    </div>
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary-container rounded-full ring-2 ring-surface-container-lowest flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-on-tertiary text-[10px]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">Campus Vault</h1>
                                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">The verified archive for research papers, notes, and exam resources.</p>
                            </div>
                        </div>

                        {/* Auth card */}
                        <div className="w-full bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-primary/5 p-space-lg flex flex-col">
                            {/* Tab switcher */}
                            <div className="relative w-full p-1 bg-surface-container-high rounded-xl flex items-center select-none mb-space-md">
                                <div 
                                    className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-surface-container-lowest rounded-lg shadow-sm transition-transform duration-300 ease-out"
                                    style={{ transform: isSignUp ? 'translateX(100%)' : 'translateX(0%)' }}
                                ></div>
                                <button 
                                    type="button"
                                    className={`relative z-10 flex-1 py-1.5 text-center font-label-md text-label-md transition-colors duration-200 ${!isSignUp ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                                    onClick={() => setIsSignUp(false)}
                                >
                                    Sign In
                                </button>
                                <button 
                                    type="button"
                                    className={`relative z-10 flex-1 py-1.5 text-center font-label-md text-label-md transition-colors duration-200 ${isSignUp ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                                    onClick={() => setIsSignUp(true)}
                                >
                                    Create Account
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative flex items-center justify-center my-space-sm">
                                <div className="w-full h-px bg-surface-variant"></div>
                                <span className="absolute px-3 bg-surface-container-lowest font-label-sm text-label-sm text-outline tracking-wider uppercase">campus mail</span>
                            </div>

                            {/* Signup bonus banner */}
                            {isSignUp && (
                                <div className="my-space-sm p-2.5 rounded-xl bg-tertiary-fixed/40 flex items-start gap-2">
                                    <span className="material-symbols-outlined text-tertiary text-lg shrink-0 mt-0.5">verified</span>
                                    <p className="font-body-sm text-body-sm leading-snug text-on-surface-variant">
                                        Sign up with your campus <span className="font-semibold">.edu</span> email to get full access to all shared resources.
                                    </p>
                                </div>
                            )}

                            {/* Form */}
                            <form className="space-y-space-md mt-space-sm" onSubmit={handleSubmit}>
                                {isSignUp && (
                                    <div className="space-y-1.5">
                                        <label className="font-label-md text-label-md font-medium text-on-surface" htmlFor="input-username">Username</label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-outline text-lg pointer-events-none">person</span>
                                            <input 
                                                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:shadow-md focus:shadow-primary/10 transition-all outline-none"
                                                id="input-username"
                                                placeholder="your username"
                                                type="text"
                                                required={isSignUp}
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="font-label-md text-label-md font-medium text-on-surface" htmlFor="input-email">Email</label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-3 text-outline text-lg pointer-events-none">alternate_email</span>
                                        <input 
                                            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:shadow-md focus:shadow-primary/10 transition-all outline-none"
                                            id="input-email"
                                            placeholder="your.email@example.com"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="font-label-md text-label-md font-medium text-on-surface" htmlFor="input-password">Password</label>
                                        {!isSignUp && (
                                            <button type="button" onClick={handleForgotPassword} className="font-label-sm text-label-sm text-primary hover:underline">Forgot pass?</button>
                                        )}
                                    </div>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-3 text-outline text-lg pointer-events-none">lock</span>
                                        <input 
                                            className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:shadow-md focus:shadow-primary/10 transition-all outline-none"
                                            id="input-password"
                                            placeholder="••••••••••••"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button 
                                            type="button" 
                                            className="absolute right-3 text-outline hover:text-on-surface flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isLoading || !email || !password || (isSignUp && !username)}
                                    className="w-full mt-space-sm py-3 px-space-md rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md shadow-primary/30 hover:bg-on-primary-fixed-variant hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="font-semibold text-body-lg">
                                        {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In to Campus Vault')}
                                    </span>
                                    <span className="material-symbols-outlined text-xl">{isSignUp ? 'person_add' : 'login'}</span>
                                </button>
                            </form>
                        </div>

                        {/* Footer badge */}
                        <div className="mt-space-lg flex flex-wrap items-center justify-center gap-x-space-md gap-y-1 text-outline font-label-sm text-label-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base text-tertiary">verified_user</span>
                                <span>Secure Authentication Protected</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Auth;
