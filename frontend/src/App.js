import './Navbar.js';
import Navbar from './Navbar';
import Practice from './Practice';
import Login from './Login';
import Social from './Social';
import Register from './Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
// import ThemeProvider from './components/ThemeContext.js';

import './styles/navbar.css';
import './styles/auth.css';
import './styles/toggle.css';
import './styles/globalStyles.css';
import './styles/practice.css';
import './styles/popup.css';
import './styles/search.css';
import './styles/pieceDetail.css';
import './styles/tooltip.css';
import './styles/loadingIcon.css';
import './styles/analytics.css';
import './styles/practiceMediaQueries.css';
import './styles/authMediaQueries.css';

import Tooltip from './components/Tooltip.js';
import { checkAuthenticated } from './services/authService.js';

export const ThemeContext = React.createContext();
export const LoginContext = React.createContext();
export const TooltipContext = React.createContext();

function App() {
  const [showNav, setShowNav] = useState(true);
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light'
  );
  const [isLoggedIn, setIsLoggedIn] = useState(checkAuthenticated());
  const [loading, setLoading] = useState(true);

  const [showTooltip, setShowTooltip] = useState(false);
  const [message, setMessage] = useState('');

  window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
  });
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const toggleMode = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    console.log(`is logged in = ${isLoggedIn}`);
  }, [isLoggedIn]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <div id="loading-div" style={{ display: loading ? 'block' : 'none' }}>
        {/* <div style={{visibility: loading ? 'visible' : 'hidden'}}> */}

        {/* <LoadingIcon /> */}
      </div>
      <div
        className="app-wrapper"
        style={{ visibility: loading ? 'hidden' : 'visible' }}
      >
        <Router>
          <ThemeContext.Provider value={theme}>
            <LoginContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
              <TooltipContext.Provider value={[setShowTooltip, setMessage]}>
                <div className={`App ${theme}`}>
                  {showNav && <Navbar toggleMode={toggleMode} />}

                  <div className="content">
                    <div className="tooltip-outer-screen">
                      <Tooltip visible={showTooltip} message={message} />
                    </div>
                    <Routes>
                      <Route
                        path="/practice"
                        element={<Practice funcNav={setShowNav} />}
                      ></Route>
                      <Route
                        path="/login"
                        element={<Login funcNav={setShowNav} />}
                      ></Route>
                      <Route
                        path="/register"
                        element={<Register funcNav={setShowNav} />}
                      ></Route>
                      <Route
                        path="/social"
                        element={<Social funcNav={setShowNav} />}
                      ></Route>
                    </Routes>
                  </div>
                </div>
              </TooltipContext.Provider>
            </LoginContext.Provider>
          </ThemeContext.Provider>
        </Router>
      </div>
    </>
  );
}

export default App;

// importing CSS at the top applies that css to every component and it's children
// otherwise you can use styled components or css modules
