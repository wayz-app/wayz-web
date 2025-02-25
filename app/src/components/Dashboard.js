import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/Dashboard.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const id = decoded.sub;
                setUserId(id);
                fetchUserData(id, token);
            } catch (error) {
                console.error('Failed to decode token:', error);
                setErrorMessage('Invalid token.');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchUserData = async (id, token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('User data:', userData);
                setUsername(userData.data.username); 
            } else {
                setErrorMessage('Failed to fetch user information.');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setErrorMessage('An error occurred while fetching user information.');
        }
    };

    // Déconnexion
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <Header />
            <div className="dashboard-content">
                <h1>🚀 Welcome to Your Dashboard</h1>

                {errorMessage && (
                    <div className="error-message">⚠️ {errorMessage}</div>
                )}

                {username ? (
                    <h2>Hello, {username} 👋</h2>
                ) : (
                    <p>Loading user information...</p>
                )}

                <p>Access your personal statistics, manage your profile, and customize your preferences effortlessly.</p>

                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <h2>📊 My Statistics</h2>
                        <p>View detailed insights about your trips, reports, and app usage.</p>
                        <button onClick={() => alert('Feature coming soon!')}>View Details</button>
                    </div>

                    <div className="dashboard-card">
                        <h2>👤 Profile</h2>
                        <p>Update your account information and preferences.</p>
                        <button onClick={() => alert('Feature coming soon!')}>Manage Profile</button>
                    </div>

                    <div className="dashboard-card">
                        <h2>⚙️ Settings</h2>
                        <p>Customize your app experience and preferences.</p>
                        <button onClick={() => alert('Feature coming soon!')}>Configure</button>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Dashboard;