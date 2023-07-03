import { useEffect, useState } from 'react';
import urls from './services/urls';
import { logout, checkAuthenticated } from './services/authService';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        setIsAuthenticated(checkAuthenticated());
    })

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        
        setIsAuthenticated(checkAuthenticated());
        console.log(checkAuthenticated());
    }
    
    return ( 
        <nav className="navbar">
            <h1>Violintice</h1>
            <div className="links">
                <a href="/">Home</a>
                <a href="/practice">Practice Tracker</a>
                {(isAuthenticated ? 
                    <div>
                        {/* <p>{localStorage.getItem('user')}</p> */}
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                    :
                    <button href="/login">Login</button>)
                }
            </div>
        </nav>
     );
}
 
export default Navbar;