import React from 'react';
import '../css/About.css';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

const About = () => {

    return (
        <>
            <Header />

            <div className="about-container">
                <h1 className="about-title">About Wayz</h1>
                <p className="about-description">
                    At <strong>Wayz</strong>, we believe in making every journey <strong>smarter, faster, and stress-free</strong>.
                    Whether you're commuting, traveling, or navigating a new city, our real-time GPS
                    app ensures you reach your destination efficiently.
                </p>

                {/* Core Information */}
                <div className="about-grid">
                    <div className="about-item">
                        <h3>Interactive Maps</h3>
                        <p>Navigate <span className="about-value">smarter</span> with real-time traffic insights.</p>
                    </div>
                    <div className="about-item">
                        <h3>Alert in One Click</h3>
                        <p>Keep everyone <span className="about-value">safe</span> by sharing road updates.</p>
                    </div>
                    <div className="about-item">
                        <h3>Optimize Driving</h3>
                        <p>Analyze your routes for a <span className="about-value">smoother</span> driving experience.</p>
                    </div>
                </div>

                {/* New "How It Works" Timeline Section */}
                <div className="how-it-works">
                    <h2 className="section-title">How It Works</h2>
                    <div className="timeline">
                        <div className="timeline-step">
                            <div className="timeline-circle">1</div>
                            <p><strong>Enter Your Destination</strong> - Simply input your target location.</p>
                        </div>
                        <div className="timeline-step">
                            <div className="timeline-circle" style={{ width: "47px" }}>2</div>
                            <p><strong>Receive Live Traffic Updates</strong> - Stay informed about accidents, road closures, and speed cameras.</p>
                        </div>
                        <div className="timeline-step">
                            <div className="timeline-circle">3</div>
                            <p><strong>Follow Optimized Routes</strong> - Let Wayz find the best and fastest way for you.</p>
                        </div>
                        <div className="timeline-step">
                            <div className="timeline-circle">4</div>
                            <p><strong>Contribute to the Community</strong> - Report incidents to improve the experience for all users.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default About;