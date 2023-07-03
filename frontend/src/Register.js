import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { host } from './services/urls';
import { register, login } from './services/authService';


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(email, password, firstName, lastName);
        // await login()
        // navigate('/practice');
    }

    return ( 
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    <label>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit">Register</button>
                    <p>Already a member?</p>
                    <a href="/login">Login</a>

                </div>
            </form>
        </div>
     );
}
 
export default Register;