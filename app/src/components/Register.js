import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/Register.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState(''); 
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate(); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrorMessage(''); 
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Registration successful!');
                setErrorMessage('');
                setTimeout(() => navigate('/login'), 1000); 
            } else {
                setErrorMessage(data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Error during query:', error);
            setErrorMessage('An error has occurred. Please try again.');
        }
    };

    return (
        <>
            <Header />
            <div className="register-content">
                <h1>Register</h1>

                {errorMessage && (
                    <div className="register-error-message">⚠️ {errorMessage}</div>
                )}

                {successMessage && (
                    <div className="register-success-message">✅ {successMessage}</div>
                )}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-form-group">
                        <label htmlFor="firstname">Firstname</label>
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="register-form-group">
                        <label htmlFor="lastname">Lastname</label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="register-form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="register-form-group">
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

                    <button type="submit" className="register-button">Register</button>

                    <div className="register-login-link">
                        <p>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Register;