import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState(''); // État pour gérer le message d'erreur

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrorMessage('');  // Effacer l'erreur lorsqu'on modifie un champ
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
                // Stocker le token dans le localStorage
                localStorage.setItem('token', data.access_token);
                navigate('/dashboard');
            } else {
                setErrorMessage(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error during login request:', error);
            setErrorMessage('An error has occurred. Please try again later.');
        }
    };

    return (
        <>
            <Header />

            <div className="login-content">
                <h1>Login</h1>

                {errorMessage && (
                    <div className="error-message">
                        ⚠️ {errorMessage} ⚠️
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
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

                    <button type="submit" className="login-button">Connexion</button>

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