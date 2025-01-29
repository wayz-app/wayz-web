import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <header className="sticky-header">
                <nav>
                    <ul>
                        <li onClick={() => navigate('/')}>Home</li>
                        <li onClick={() => navigate('/about')}>About</li>
                        <li onClick={() => navigate('/login')}>Login</li>
                    </ul>
                </nav>
            </header>
                <div className="home-content">
                    <div className="section welcome-section">
                        <h1>Welcome on Wayz</h1>
                        <p>Your real-time guide for stress-free journeys.</p>
                    </div>

                    <div className="section download-section">
                        <h2>Download the App</h2>
                        <p>Get started with Wayz today and simplify your navigation.</p>
                        <div className="download-buttons">
                            <a 
                                href="https://apps.apple.com/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <img 
                                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                                    alt="Download on the App Store"
                                    className="store-badge"
                                />
                            </a>

                            <a 
                                href="https://play.google.com/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                                    alt="Get it on Google Play"
                                    className="store-badge"
                                />
                            </a>
                        </div>
                    </div>
                

                    <div className="section key-numbers-modern-alt">
                        <h1 className="key-numbers-title">Key Numbers</h1>
                        <div className="key-numbers-circle-grid">
                            <div className="key-number-circle-item">
                            <div className="circle">
                                <p className="key-number-value">+100,000</p>
                            </div>
                            <h3>Optimized Trips</h3>
                            </div>
                            <div className="key-number-circle-item">
                            <div className="circle">
                                <p className="key-number-value">+50,000</p>
                            </div>
                            <h3>Real-Time Alerts</h3>
                            </div>
                            <div className="key-number-circle-item">
                            <div className="circle">
                                <p className="key-number-value">+30%</p>
                            </div>
                            <h3>Faster Routes</h3>
                            </div>
                        </div>
                    </div>

                    <div className="section comparative-table-section">
                        <h2 className="comparative-table-title">Compare Wayz</h2>
                        <table className="comparative-table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Wayz</th>
                                    <th>Waze</th>
                                    <th>Google Maps</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Real-time Navigation</td>
                                    <td>✅</td>
                                    <td>✅</td>
                                    <td>✅</td>
                                </tr>
                                <tr>
                                    <td>Incident Reporting</td>
                                    <td>✅</td>
                                    <td>✅</td>
                                    <td>❌</td>
                                </tr>
                                <tr>
                                    <td>Community Validation</td>
                                    <td>✅</td>
                                    <td>✅</td>
                                    <td>❌</td>
                                </tr>
                                <tr>
                                    <td>Traffic Alerts</td>
                                    <td>✅</td>
                                    <td>✅</td>
                                    <td>✅</td>
                                </tr>
                                <tr>
                                    <td>Cost-Based Routing</td>
                                    <td>✅</td>
                                    <td>❌</td>
                                    <td>✅</td>
                                </tr>
                                <tr>
                                    <td>Web Interface</td>
                                    <td>✅</td>
                                    <td>❌</td>
                                    <td>✅</td>
                                </tr>
                                <tr>
                                    <td>QR Code Sharing</td>
                                    <td>✅</td>
                                    <td>❌</td>
                                    <td>❌</td>
                                </tr>
                                <tr>
                                    <td>Predictive Traffic Insights</td>
                                    <td>✅</td>
                                    <td>❌</td>
                                    <td>✅</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
        </>
    );
};

export default Home;