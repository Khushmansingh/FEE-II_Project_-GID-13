import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Nav from './Nav';
import Home from './components/Home';
import Browse from './Browse';
import Login from './Login';
import SignUp from './SignUp';
import './App.css';
function App() {
  const [theme, setTheme] = useState('dark');
  const [session, setSession] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  function toggleTheme() {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }
  if (!session) {
    if (showSignUp) {
      return <SignUp onSwitchToLogin={() => setShowSignUp(false)} />;
    } else {
      return <Login onSwitchToSignUp={() => setShowSignUp(true)} />;
    }
  }
  return (
    <BrowserRouter>
      <div className="App">
        <Nav theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/browse" element={<Browse theme={theme} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;