import React from 'react';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Wayz. All rights reserved.</p>
            <p>
                <a href="/privacy-policy">Privacy Policy</a> |  
                <a href="/terms-of-service"> Terms of Service</a> |  
                <a href="/legal-notices"> Legal Notices</a>
            </p>
        </footer>
    );
};

export default Footer;