import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { host } from './services/urls';
import { login } from './services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
        navigate('/Practice');
    }
    
    return ( 
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit">Login</button>
                    <p>Not a member yet?</p>
                    <a href="/register">Register</a>

                </div>
            </form>

        </div>
     );
}
 
export default Login;