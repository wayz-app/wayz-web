import React, { useEffect, useState } from 'react';
import '../css/Footer.css';

const Footer = () => {
    const [hostname, setHostname] = useState("Loading...");
    
    useEffect(() => { 
        fetch("/host")
            .then(res => res.json())
            .then(data => setHostname(data.hostname))
            .catch(() => setHostname("dev")); 
    }, []);

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-main">
                    <p className="copyright">&copy; {new Date().getFullYear()} Wayz. All rights reserved.</p>
                    
                    <div className="footer-links">
                        <a href="/privacy-policy">Privacy Policy</a>
                        <span className="footer-divider">|</span>
                        <a href="/terms-of-service">Terms of Service</a>
                        <span className="footer-divider">|</span>
                        <a href="/legal-notices">Legal Notices</a>
                    </div>
                </div>
                
                <div className="app-info">
                    <div className="info-item">
                        <span className="info-label">Version:</span>
                        <span className="info-value">{process.env.REACT_APP_VERSION}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Host:</span>
                        <span className="info-value">{hostname}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;