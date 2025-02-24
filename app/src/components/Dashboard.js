import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        alert('You have been logged out.');
        navigate('/login');
    };

    return (
        <>
            <Header />
            <div className="dashboard-content">
                <h1>🚀 Welcome to Your Dashboard</h1>
                <p>Access your personal statistics, manage your profile, and customize your preferences effortlessly.</p>

                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <h2>📊 My Statistics</h2>
                        <p>View detailed about your trips, reports, and app usage.</p>
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