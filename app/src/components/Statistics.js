import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/Statistics.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Statistics = () => {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');

    const handleInvalidToken = useCallback(() => {
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUserId(decoded.sub);
        } catch (error) {
            console.error('Failed to decode token:', error);
            handleInvalidToken();
        }
    }, [navigate, handleInvalidToken]);

    useEffect(() => {
        if (!userId) return;
        
        const fetchStatistics = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    handleInvalidToken();
                    return;
                }

                const response = await fetch(`${process.env.REACT_APP_API_URL}/statistic/my-events`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.status === 401) {
                    handleInvalidToken();
                    return;
                }

                if (response.ok) {
                    setStatistics(data);
                } else {
                    setError(data.message || 'Failed to fetch statistics.');
                }
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError('An error occurred while fetching statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [userId, navigate, handleInvalidToken]);

    const getRandomColor = () => {
        const colors = [
            '#4285F4', '#34A853', '#FBBC05', '#EA4335', 
            '#3498db', '#2ecc71', '#f1c40f', '#e74c3c', 
            '#9b59b6', '#1abc9c', '#e67e22', '#95a5a6' 
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const renderEventTypeChart = () => {
        if (!statistics || !statistics.event_types || statistics.event_types.length === 0) {
            return <div className="statistics-no-data">No event type data available</div>;
        }
    
        const eventTypeColors = {
            'slow_traffic': '#4285F4',
            'visible_police': '#EA4335',
            'pile_up_crash': '#FBBC05',
            'hidden_police': '#34A853',
            'roadkill_hazard': '#9b59b6',
            'icy_road_weather': '#1abc9c',
            'standstill_traffic': '#e67e22'
        };
    
        return (
            <div className="statistics-event-type-chart">
                <h3>Event Types Distribution</h3>
                <div className="statistics-chart-container">
                    {statistics.event_types.map((type, index) => {
                        const eventType = type.event_type;
                        const color = eventTypeColors[eventType] || getRandomColor();
                        
                        return (
                            <div key={index} className="statistics-chart-item">
                                <div className="statistics-chart-label">
                                    <span className="statistics-color-indicator" style={{ backgroundColor: color }}></span>
                                    <span>{eventType.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="statistics-chart-bar-container">
                                    <div 
                                        className="statistics-chart-bar" 
                                        style={{ 
                                            width: `${type.percentage}%`,
                                            backgroundColor: color
                                        }}
                                    ></div>
                                    <span className="statistics-chart-percentage">{type.percentage.toFixed(2)}%</span>
                                </div>
                                <div className="statistics-chart-count">{type.count} event{type.count !== 1 ? 's' : ''}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            <Header />
            <div className="statistics-content">
                <div className="statistics-breadcrumb">
                    <span onClick={() => navigate('/dashboard')} className="statistics-breadcrumb-link">Dashboard</span>
                    <span className="statistics-breadcrumb-separator"> / </span>
                    <span onClick={() => navigate('/statistics')} className="statistics-breadcrumb-link">My statistics</span>
                </div>

                <h1>📊 My Statistics</h1>
                <p>View detailed statistics about your events and activities.</p>

                {error && <div className="statistics-error-message">⚠️ {error}</div>}
                
                {loading ? (
                    <div className="statistics-loading-container">
                        <div className="statistics-loading-spinner"></div>
                        <p>Loading your statistics...</p>
                    </div>
                ) : statistics ? (
                    <div className="statistics-dashboard">
                        <div className="statistics-cards">
                            <div className="statistics-stat-card statistics-total-events">
                                <div className="statistics-stat-icon">📝</div>
                                <div className="statistics-stat-content">
                                    <h3>Total Events</h3>
                                    <div className="statistics-stat-value">{statistics.total_events}</div>
                                </div>
                            </div>
                            
                            <div className="statistics-stat-card statistics-monthly-events">
                                <div className="statistics-stat-icon">🗓️</div>
                                <div className="statistics-stat-content">
                                    <h3>Events This Month</h3>
                                    <div className="statistics-stat-value">{statistics.events_this_month}</div>
                                </div>
                            </div>
                        </div>
                        
                        {renderEventTypeChart()}
                    </div>
                ) : (
                    <div className="statistics-no-data-message">
                        <p>No statistics available. Start by creating some events!</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Statistics;