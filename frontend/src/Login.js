import { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = 'http://localhost:8000/api/login/';

        try {
            const response = await fetch(url, requestOptions);
            const jsonData = await response.json();
            console.log(jsonData.token);
            localStorage.setItem('authToken', jsonData.token);
        } catch (error) {
            console.error('Login failed:', error);
        }
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

                </div>
            </form>

        </div>
     );
}
 
export default Login;