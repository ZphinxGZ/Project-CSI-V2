import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3456/api/auth/login', {
                username,
                password
            });
            if (response.data.token) {
                onLoginSuccess(response.data.token);
                // alert('Login success');
            }
        } catch (error) {
            setError('Incorrect username or password');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <form className="form">
                    <p className="form-title">Sign in to your account</p>
                    <div className="input-container">
                        <input 
                            type="text" 
                            placeholder="Enter username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div className="input-container">
                        <input 
                            type="password" 
                            placeholder="Enter password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button type="button" className="submit" onClick={handleLogin}>Sign in</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <p className="signup-link">
                        No account?
                        <a href="#" onClick={() => navigate('/register')}>Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;