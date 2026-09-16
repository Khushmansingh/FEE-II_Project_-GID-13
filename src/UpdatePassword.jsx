import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function UpdatePassword({ onComplete }) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleUpdatePassword(e) {
        e.preventDefault();
        if (!password || password.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
        }
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: password });
            if (error) throw error;
            alert('Password updated successfully!');
            onComplete();
        } catch (error) {
            alert('Error updating password: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center p-space-md">
            <div className="w-full max-w-[460px] bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-primary/5 p-space-lg flex flex-col items-center">
                <span className="material-symbols-outlined text-primary text-5xl mb-4">lock_reset</span>
                <h1 className="font-headline-md text-headline-md font-bold mb-2 text-center">Reset Your Password</h1>
                <p className="text-on-surface-variant text-center mb-space-lg text-body-sm">
                    Please enter your new password below.
                </p>

                <form onSubmit={handleUpdatePassword} className="w-full space-y-space-md">
                    <div className="space-y-1.5">
                        <label className="font-label-md text-label-md font-medium text-on-surface" htmlFor="new-password">New Password</label>
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-outline text-lg pointer-events-none">lock</span>
                            <input 
                                className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:shadow-md focus:shadow-primary/10 transition-all outline-none"
                                id="new-password"
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
                        disabled={isLoading || !password}
                        className="w-full mt-space-sm py-3 px-space-md rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md shadow-primary/30 hover:bg-on-primary-fixed-variant transition-all duration-200 disabled:opacity-50"
                    >
                        <span className="font-semibold text-body-lg">
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdatePassword;
