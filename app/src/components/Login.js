import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Login.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Google logo SVG - inline for simplicity
const GoogleLogo = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        
        if (token) {
            localStorage.setItem('token', token);
            window.history.replaceState({}, document.title, location.pathname);
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 100);
        } else {
            console.log('No token found in URL');
        }
    }, [navigate, location]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrorMessage('');
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                navigate('/dashboard');
            } else {
                setErrorMessage(data.details || data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error during login request:', error);
            setErrorMessage('An error has occurred. Please try again later.');
        }
    };
    
    const handleGoogleLogin = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}/auth/google/login`;
    };
    
    return (
        <>
            <Header />
            
            <div className="login-content">
                <h1>Login</h1>
                
                {errorMessage && (
                    <div className="error-message">
                        ⚠️ {errorMessage}
                    </div>
                )}
                
                <form className="login-form" onSubmit={handleSubmit}>
                    <button 
                        type="button" 
                        className="google-login-button"
                        onClick={handleGoogleLogin}
                    >
                        <GoogleLogo />
                        Continue with Google
                    </button>
                    
                    <div className="login-divider">
                        <span>OR</span>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="login-button">Login</button>
                    
                    <div className="login-register-link">
                        <p>Don't have an account? <span onClick={() => navigate('/register')}>Register</span></p>
                    </div>
                </form>
            </div>
            
            <Footer />
        </>
    );
};

export default Login;
