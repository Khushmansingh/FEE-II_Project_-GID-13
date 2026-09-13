import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import Supabase
// We are not using Context API anymore, so no ThemeProvider import
import Nav from './Nav';
import Home from './components/Home';
import Browse from './Browse';
import Login from './Login'; // Import our Login page
import SignUp from './SignUp'; // Import our new SignUp page
import './App.css';

// This is our main application component
function App() {
  // We use state to keep track of the theme (dark or light)
  const [theme, setTheme] = useState('dark');
  
  // State to track if the user is logged in
  const [session, setSession] = useState(null);
  
  // State to track if we should show the Sign Up page instead of Login
  const [showSignUp, setShowSignUp] = useState(false);

  // We use useEffect to change the theme attribute on the HTML tag when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // We use another useEffect to check if the user is logged in when the app starts
  useEffect(() => {
    // Check if there's an active session right now
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes (like if the user logs in or logs out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup the listener when the app closes
    return () => subscription.unsubscribe();
  }, []);

  // Function to toggle between dark and light themes
  function toggleTheme() {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }

  // If there is no user logged in, just show the Login or Sign Up page
  if (!session) {
    if (showSignUp) {
      return <SignUp onSwitchToLogin={() => setShowSignUp(false)} />;
    } else {
      return <Login onSwitchToSignUp={() => setShowSignUp(true)} />;
    }
  }

  // If the user is logged in, show the full app
  return (
    <BrowserRouter>
      {/* We pass the theme state down to our components using props */}
      <div className="App">
        {/* Nav needs to know the theme and how to toggle it */}
        <Nav theme={theme} toggleTheme={toggleTheme} />
        
        {/* These are the different pages in our app */}
        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/browse" element={<Browse theme={theme} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Export the component so other files can use it
export default App;