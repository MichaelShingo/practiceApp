import { useEffect, useState } from 'react';
import urls from './services/urls';
import { logout, checkAuthenticated } from './services/authService';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';
import { ReactComponent as Hamburger } from './svg/hamburger.svg';

import './styles/navbar.css';

const Navbar = ( {toggleMode} ) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [url, setUrl] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    let displayValue;

    if (screenWidth > 815) {
        displayValue = 'flex';
    } else {
        displayValue = showMenu ? 'flex' : 'none';
    }

    const handleResize = () => {
        setScreenWidth(window.innerWidth);
    }

    useEffect(() => {
        setIsAuthenticated(checkAuthenticated());

        window.addEventListener('resize', handleResize);
    }, []); // should this actually have an empty dependency array? 

    useEffect(() => {
        setUrl(location.pathname);
    }, [location])

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        
        setIsAuthenticated(checkAuthenticated());
        console.log(checkAuthenticated());
    }

    const handleHamburgerClick = () => {
        setShowMenu(prev => !prev);
        console.log('show menu');
    }
    
    return ( 
        <div className="navbar row">
            <div className="col-1"></div>
            <div className="col-10 nav-content">
                <div className="row">
                    <div className="col-3">
                        <h1>Violintice</h1>
                    </div>
                    <div className="col-3 nav-bar-middle" ></div>
                    
                    <div 
                        className="col-6 links"
                        style={{
                            top: displayValue === 'flex' ? '0%' : '-500%'
                        }}
                    >
                        <ThemeToggle 
                            toggleMode={toggleMode}
                        />
                        {/* <button className="nav-active"></button> */}
                        <a className={url === '/practice' ? 'active' : ''} href="/practice">Practice</a>
                        <a className={url === '/social' ? 'active' : ''} href="/social">Social</a>
                        <a className={url === '/feedback' ? 'active' : ''} href="/feedback">Feedback</a>
                        
                        {(isAuthenticated ? 
                            <a onClick={handleLogout}>Logout</a>
                            :
                            <a className={url === '/login' ? 'active' : ''} href="/login">Login</a>)
                        }
                    </div>
                </div>
                <div 
                    className="hamburger"
                    onClick={handleHamburgerClick}
                >
                    <div className="hamburger-line-container">
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                    </div>
                </div>
            </div>
            <div className="col-1"></div>
        </div>      
     );
}
 
export default Navbar;