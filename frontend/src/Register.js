import {useState, useEffect} from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { host } from './services/urls';
import { register, login } from './services/authService';
import { checkAuthenticated } from './services/authService';


const Register = ({ funcNav }) => {
    funcNav(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('Server error, unable to create account.');
    

    const successStyle = {
        backgroundColor: isSuccess ? "#07c400" : "none"
    }
    
    useEffect(() => {
        if (checkAuthenticated()) {
            navigate('/practice');
        }
    })
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsRegistering(true);
        const result = await register(email, password, firstName, lastName);
        console.log(result);
        const navigateToLogin = () => {
            navigate('/login')
        }
        if (result.ok) {
            setIsRegistering(false);
            setIsSuccess(true);
            setTimeout(navigateToLogin, 1000);
            
        } else {
            setIsRegistering(false);
            setIsError(true);
            const json = await result.json();
            setErrorMessage(json.error);
        }    
    }

    return ( 
        <div className="login-background">
            <div className="row login-row">
                <div className="col-4"></div>
                <div className="col-4 login-box">
                    <h2 className="login-heading">Register a New Account</h2>
                    <p>Ready to start your violin journey?</p>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input className={firstNameError && "input-error"} placeholder="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <input placeholder="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                        <input placeholder="Your Email"type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input placeholder="Choose a password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        {isError && <p className="error">{errorMessage}</p>}
                        <button style={successStyle} className="login-button" type="submit">
                            {isSuccess && 'Success! Please login...'}
                            {isRegistering && 'Creating account...'}
                            {!isRegistering && !isSuccess && 'Register'}
                        </button>
                        <p>Already a member? <a href="/login">Login</a></p>
                        
                    </form>
                </div>
            </div>
        </div>
     );
}
 
export default Register;