import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="legal-container">
            <h1>Privacy Policy</h1>
            <p>Effective Date: {new Date().getFullYear()}</p>

            <h2>1. Introduction</h2>
            <p>Welcome to Wayz. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.</p>

            <h2>2. Data We Collect</h2>
            <p>We may collect the following data:</p>
            <ul>
                <li>Personal information (name, email, phone number)</li>
                <li>Location data for navigation and route optimization</li>
                <li>Device and usage data (IP address, browser type, app activity)</li>
            </ul>

            <h2>3. How We Use Your Data</h2>
            <p>We use your data to:</p>
            <ul>
                <li>Provide real-time navigation and traffic updates</li>
                <li>Improve user experience and app performance</li>
                <li>Ensure security and prevent fraudulent activity</li>
            </ul>

            <h2>4. Sharing Your Information</h2>
            <p>We do not sell or rent your data. However, we may share it with:</p>
            <ul>
                <li>Service providers who assist in app functionality</li>
                <li>Authorities if required by law</li>
            </ul>

            <h2>5. Your Rights</h2>
            <p>You have the right to access, modify, or delete your personal data. Contact us at <a href="mailto:support@wayz.com">support@wayz.com</a> for requests.</p>

            <h2>6. Updates</h2>
            <p>We may update this policy. Continued use of Wayz means you accept the latest version.</p>

            <h2>7. Contact</h2>
            <p>If you have any questions, contact us at <a href="mailto:support@wayz.com">support@wayz.com</a>.</p>
        </div>
    );
};

export default PrivacyPolicy;