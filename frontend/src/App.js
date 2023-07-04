import './Navbar.js';
import Navbar from './Navbar';
import Practice from './Practice';
import Login from './Login';
import SignUp from './SignUp';
import Register from './Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
  const [showNav, setShowNav] = useState(true);
  const [theme, setTheme] = useState('light');

  const toggleMode = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    console.log(theme);
  }

  useEffect(() => {
    document.body.className = theme;
  }, [theme])
  
  return (
    <Router>
      <div className={`App ${theme}`}>

        { showNav && <Navbar toggleMode={toggleMode}/> }
        <div className="content">
          <Routes>
            <Route path="/practice" element={<Practice funcNav={setShowNav}/>}></Route>
            <Route path="/login" element={<Login funcNav={setShowNav}/>}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/register" element={<Register funcNav={setShowNav}/>}></Route>
          </Routes>
        </div>
    </div>
    </Router>

  );
}

export default App;

// importing CSS at the top applies that css to every component and it's children
// otherwise you can use styled components or css modules
