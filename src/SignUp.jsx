import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// This is our new SignUp component
function SignUp(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This function runs when the user clicks "Sign Up"
  async function handleSignUp(e) {
    e.preventDefault(); // Prevent page reload
    setIsLoading(true);

    try {
      // Ask Supabase to create a new user
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      alert('Check your email for the login link or you might be logged in automatically!');
      // After signing up, we can switch back to the login view
      props.onSwitchToLogin();
    } catch (error) {
      alert('Error signing up: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="layout-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header">
          <h2 className="card-title">Create an Account</h2>
        </div>
        
        <div className="card-body">
          <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
            Join Campus Vault to share and access notes.
          </p>

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
              onClick={handleSignUp}
              disabled={isLoading || !email || !password}
              style={{ width: '100%', marginTop: '10px' }}
            >
              {isLoading ? 'Loading...' : 'Sign Up'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Already have an account? </span>
              <button 
                type="button" 
                onClick={props.onSwitchToLogin}
                style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
