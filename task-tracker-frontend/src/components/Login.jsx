import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password) {
            setError('Please enter your username and password');
            return;
        }

        try {
            const response = await fetch('http://localhost:8090/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.accessToken);
                const decoded = jwtDecode(data.accessToken)
                localStorage.setItem('id', decoded.id);
                localStorage.setItem('username', username);
                navigate('/dashboard');
            } else if (response.status === 403) {
                setError('Invalid username or password');
            } else {
                setError(data.message || 'Invalid username or password');
            }
        } catch (err) {
            setError('Failed to connect to the server');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome back</h1>
                    <p>Sign in to your account</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="john_doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Sign In
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Don't have an account?</span>
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="auth-link"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}