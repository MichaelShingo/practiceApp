import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { host } from './services/urls';
import { login } from './services/authService';
import { checkAuthenticated } from './services/authService';
import { LoginContext } from './App';

const Login = ({ funcNav }) => {
  funcNav(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      //   navigate('/practice');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    const result = await login(email, password);
    if (result >= 400) {
      setInvalidLogin(true);
      setIsLogging(false);
    } else {
      // successfully logged in
      setIsLoggedIn(true);
      navigate('/practice');
    }
  };

  return (
    <div className="login-background">
      <div className="row login-row">
        <div className="col-4 login-box">
          <h2 className="login-heading">Login to Your Account</h2>
          <p>Continue your violin adventure.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <input
                placeholder="Your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                placeholder="Your Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {invalidLogin && <p className="error">Invalid credentials.</p>}
              <button className="login-button" type="submit">
                {isLogging ? 'Logging in...' : 'Login'}
              </button>
              <p>
                Not a member yet? <a href="/register">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
