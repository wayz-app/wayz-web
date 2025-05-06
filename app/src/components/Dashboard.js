import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/Dashboard.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true); 

    const handleInvalidToken = useCallback(() => {
        localStorage.removeItem('token');
        setErrorMessage('Session expired. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
    }, [navigate]);

    const fetchUserData = useCallback(async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleInvalidToken();
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.status === 401 && data.detail === 'Invalid token') {
                handleInvalidToken();
                return;
            }

            if (response.ok) {
                setUsername(data.data.username);
            } else {
                setErrorMessage(data.message || 'Failed to fetch user information.');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setErrorMessage('An error occurred while fetching user information.');
        } finally {
            setLoading(false);
        }
    }, [handleInvalidToken]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const id = decoded.sub;
                setUserId(id);
            } catch (error) {
                console.error('Failed to decode token:', error);
                handleInvalidToken();
            }
        } else {
            navigate('/login');
        }
    }, [navigate, handleInvalidToken]);

    useEffect(() => {
        if (userId) {
            fetchUserData(userId);
        }
    }, [userId, fetchUserData]); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <Header />
            <div className="dashboard-content">
                <h1>Welcome to Your Dashboard</h1>

                {errorMessage && <div className="dashboard-error-message">⚠️ {errorMessage}</div>}

                {loading ? (
                    <div className="dashboard-loading">
                        <p>Loading user information...</p>
                    </div>
                ) : (
                    <h2>Hello, {username || 'User'} 👋</h2>
                )}

                <p>Access your personal statistics, manage your profile, and customize your preferences effortlessly.</p>

                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <h2>📊 My Statistics</h2>
                        <p>View detailed about your trips, reports, and app usage.</p>
                        <button onClick={() => navigate('/statistics')}>View Statistics</button>
                    </div>

                    <div className="dashboard-card">
                        <h2>👤 Profile</h2>
                        <p>Update your account information and preferences.</p>
                        <button onClick={() => navigate('/profile')}>Manage Profile</button>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <button className="dashboard-logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Dashboard;