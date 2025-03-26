import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

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
            const response = await axios.post('http://localhost:3456/api/auth/register', {
                username,
                password,
                role: 'user'
            });
            console.log(response.data); // เพิ่มการดีบัก
            if (response.data.success) {
                console.log('Registration successful, navigating to login'); // เพิ่มการดีบัก
                navigate('/login');
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <form className="form">
                    <p className="form-title">Create your account</p>
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
                    <div className="input-container">
                        <input 
                            type="password" 
                            placeholder="Confirm password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </div>
                    <button type="button" className="submit" onClick={handleRegister}>Register</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <p className="signup-link">
                        Already have an account?
                        <a href="#" onClick={() => navigate('/login')}>Sign in</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;