import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css'; // Let's use standard app classes for now

// This is our Login component
function Login(props) {
  // We need state to store what the user types in the email and password boxes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State to show a loading message
  const [isLoading, setIsLoading] = useState(false);

  // This function runs when the user clicks "Sign In"
  async function handleSignIn(e) {
    e.preventDefault(); // Prevent page reload
    setIsLoading(true);

    try {
      // Ask Supabase to sign the user in
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }
      
      // If successful, App.jsx will automatically see the new session and show the app
    } catch (error) {
      alert('Error signing in: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="layout-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header">
          <h2 className="card-title">Welcome to Campus Vault</h2>
        </div>
        
        <div className="card-body">
          <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
            Please sign in to continue.
          </p>

          {/* Form for email and password */}
          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', width: '100%', color: 'var(--text-color)', backgroundColor: 'var(--bg-color)' }}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', width: '100%', color: 'var(--text-color)', backgroundColor: 'var(--bg-color)' }}
                required
              />
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={handleSignIn}
              disabled={isLoading || !email || !password}
              style={{ width: '100%', marginTop: '10px' }}
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Don't have an account? </span>
              <button 
                type="button" 
                onClick={props.onSwitchToSignUp}
                style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
