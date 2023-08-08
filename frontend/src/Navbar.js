import { useEffect, useState } from 'react';
import urls from './services/urls';
import { logout, checkAuthenticated } from './services/authService';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';
import './styles/navbar.css';

const Navbar = ( {toggleMode} ) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [url, setUrl] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(checkAuthenticated());
    }, )

    useEffect(() => {
        setUrl(location.pathname);
    }, [location])

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        
        setIsAuthenticated(checkAuthenticated());
        console.log(checkAuthenticated());
    }
    
    return ( 
        <div className="navbar row">
            <div className="col-1"></div>

            <div className="col-10 nav-content">
                <div className="row">
                    <div className="col-3">
                        <h1>Violintice</h1>
                    </div>
                    <div className="col-3"></div>
                    <div className="col-6 links">
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
            </div>
            <div className="col-1"></div>
        </div>
            

            
     );
}
 
export default Navbar;