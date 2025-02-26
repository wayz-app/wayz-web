import React, { useEffect, useState } from 'react';
import '../css/Footer.css';

const Footer = () => {
    const [hostname, setHostname] = useState("Loading...");
    useEffect(() => { fetch("/host").then(res => res.json()).then(data => setHostname(data.hostname)).catch(() => setHostname("dev")); }, []);

    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Wayz. All rights reserved.</p>
            <p>
                <a href="/privacy-policy">Privacy Policy</a> |  
                <a href="/terms-of-service"> Terms of Service</a> |  
                <a href="/legal-notices"> Legal Notices</a>
            </p>
            <div className="app-info">
                <span>Version: {process.env.REACT_APP_VERSION}</span>
                <span>Host: {hostname}</span>
            </div>
        </footer>
    );
};

export default Footer;