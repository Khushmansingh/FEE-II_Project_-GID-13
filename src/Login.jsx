import { useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

export function Login({ onSwitchToSignUp }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    async function handleSignIn(e) {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            });
            if (error) throw error;
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="layout-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
            <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
                <div className="card-header">
                    <h2 className="card-title">Welcome to Campus Vault</h2>
                </div>
                <div className="card-body">
                    <p style={{ marginBottom: '20px', color: 'var(--color-outline)' }}>
                        Please sign in to access shared campus notes.
                    </p>
                    {errorMsg && (
                        <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#ffdad6', color: '#93000a', fontSize: '14px', marginBottom: '15px' }}>
                            {errorMsg}
                        </div>
                    )}
                    <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 600 }}>Email</label>
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)', width: '100%', color: 'inherit', backgroundColor: 'transparent' }}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 600 }}>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)', width: '100%', color: 'inherit', backgroundColor: 'transparent' }}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading || !email || !password}
                            style={{ width: '100%', marginTop: '10px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                        {onSwitchToSignUp && (
                            <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                <span style={{ color: 'var(--color-outline)', fontSize: '14px' }}>Don't have an account? </span>
                                <button 
                                    type="button" 
                                    onClick={onSwitchToSignUp}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', fontWeight: 600 }}
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;