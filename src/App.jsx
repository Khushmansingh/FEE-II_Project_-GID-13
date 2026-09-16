import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Browse from './Browse';
import Auth from './Auth';
import Layout from './Layout';
import UpdatePassword from './UpdatePassword';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    // Check if URL has access_token and type=recovery when the app initially loads
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
        setIsRecoveringPassword(true);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveringPassword(true);
      }
      setSession(session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }

  if (isRecoveringPassword) {
    return <UpdatePassword onComplete={() => {
        setIsRecoveringPassword(false);
        // Clear the URL hash so it doesn't trigger again on reload
        window.history.replaceState(null, '', window.location.pathname);
    }} />;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Layout toggleTheme={toggleTheme} theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;