import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                username,
                password,
                role: 'user'
            });
            if (response.data.success) {
                navigate('/login');
            }
        } catch (error) {
            setError('Registration failed');
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h2>Register</h2>
                <input 
                    className='register-input' 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                <button onClick={handleRegister}>Register</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button onClick={() => navigate('/login')}>Back to Login</button>
            </div>
        </div>
    );
}

export default Register;
