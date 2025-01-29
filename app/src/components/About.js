import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/About.css';

const About = () => {
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
            <div>
                <div className="features-banner">
                    <div className="features-grid">
                        <div className="features-item">
                            <h3>Interactive maps</h3>
                            <p>Navigate <span className="features-value">smarter</span> with real-time traffic insights.</p>
                        </div>
                        <div className="features-item">
                            <h3>Alert in one click</h3>
                            <p>Keep everyone <span className="features-value">safe</span> by sharing road updates.</p>
                        </div>
                        <div className="features-item">
                            <h3>Optimize Driving</h3>
                            <p>Analyze your routes for a <span className="features-value">smoother</span> driving experience.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
