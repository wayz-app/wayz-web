import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Home = () => {
    const navigate = useNavigate();
    
    return (
        <>
            <Header />
            
            <div className="home-component">
                <div className="home-content">
                    {/* Hero Section */}
                    <div className="home-hero-section">
                        <h1>Welcome to Wayz</h1>
                        <p>Your real-time guide for stress-free journeys.</p>
                        <p>Navigate smarter, not harder.</p>
                        <button 
                            className="home-cta-button"
                            onClick={() => navigate('/navigate')}
                        >
                            Start Navigation
                        </button>
                    </div>

                    {/* App Download Section */}
                    <div className="home-download-section">
                        <h2>Download the Wayz App</h2>
                        <p>Get started with Wayz today and simplify your navigation on all your devices.</p>
                        <div className="home-download-buttons">
                            <a 
                                href="https://apps.apple.com/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <img 
                                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                                    alt="Download on the App Store"
                                    className="home-store-badge"
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
                                    className="home-store-badge"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Key Numbers Section */}
                    <div className="home-key-numbers-section">
                        <h2 className="home-key-numbers-title">Key Numbers</h2>
                        <div className="home-key-numbers-grid">
                            <div className="home-key-number-card">
                                <div className="home-key-number-value">+100,000</div>
                                <h3>Optimized Trips</h3>
                                <p>Users have optimized over 100,000 trips with our intelligent routing system.</p>
                            </div>
                            
                            <div className="home-key-number-card">
                                <div className="home-key-number-value">+50,000</div>
                                <h3>Real-Time Alerts</h3>
                                <p>Stay informed with over 50,000 real-time alerts about traffic and road conditions.</p>
                            </div>
                            
                            <div className="home-key-number-card">
                                <div className="home-key-number-value">+30%</div>
                                <h3>Faster Routes</h3>
                                <p>Our users save on average 30% of their travel time using our optimized routes.</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature Comparison Section */}
                    <div className="home-comparison-section">
                        <h2>Compare Wayz</h2>
                        <table className="home-comparison-table">
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
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-available">✓</td>
                                </tr>
                                <tr>
                                    <td>Incident Reporting</td>
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-unavailable">✗</td>
                                </tr>
                                <tr>
                                    <td>Community Validation</td>
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-unavailable">✗</td>
                                </tr>
                                <tr>
                                    <td>Traffic Alerts</td>
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-available">✓</td>
                                </tr>
                                <tr>
                                    <td>Cost-Based Routing</td>
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-unavailable">✗</td>
                                    <td className="home-feature-available">✓</td>
                                </tr>
                                <tr>
                                    <td>Web Interface</td>
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-unavailable">✗</td>
                                    <td className="home-feature-available">✓</td>
                                </tr>
                                <tr>
                                    <td>QR Code Sharing</td>
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-unavailable">✗</td>
                                    <td className="home-feature-unavailable">✗</td>
                                </tr>
                                <tr>
                                    <td>Predictive Traffic Insights</td>
                                    <td className="home-feature-available">✓</td>
                                    <td className="home-feature-unavailable">✗</td>
                                    <td className="home-feature-available">✓</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <Footer />
        </>
    );
};

export default Home;