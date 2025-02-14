import React from 'react';

const TermsOfService = () => {
    return (
        <div className="legal-container">
            <h1>Terms of Service</h1>
            <p>Effective Date: {new Date().getFullYear()}</p>

            <h2>1. Acceptance of Terms</h2>
            <p>By using Wayz, you agree to comply with these Terms of Service. If you do not agree, please do not use our services.</p>

            <h2>2. Use of Service</h2>
            <p>You agree to use Wayz responsibly and not engage in:</p>
            <ul>
                <li>Illegal activities</li>
                <li>Disrupting the service or tampering with data</li>
                <li>Uploading harmful content</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password.</p>

            <h2>4. Limitation of Liability</h2>
            <p>We provide the service "as is" without guarantees. We are not responsible for:</p>
            <ul>
                <li>Delays or inaccuracies in traffic data</li>
                <li>Any damage or loss resulting from app usage</li>
            </ul>

            <h2>5. Termination</h2>
            <p>We may suspend or terminate your access if you violate these terms.</p>

            <h2>6. Changes to Terms</h2>
            <p>We may modify these terms at any time. Continued use of Wayz means you accept the updated terms.</p>

            <h2>7. Contact</h2>
            <p>For questions, contact us at <a href="mailto:support@wayz.com">support@wayz.com</a>.</p>
        </div>
    );
};

export default TermsOfService;