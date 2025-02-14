import React from 'react';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import '../css/Footer.css';

const LegalNotices = () => {
    return (
        <>
            <Header />

            <div className="legal-container">
                <h1>Legal Notices</h1>

                <h2>1. Publisher</h2>
                <p>Wayz is developed and operated by Trafine, a fictional company.</p>

                <h2>2. Hosting Provider</h2>
                <p>The Wayz application and website are hosted by [Hosting Provider Name], located at [Hosting Address].</p>

                <h2>3. Intellectual Property</h2>
                <p>All content, trademarks, and logos on Wayz are the property of Trafine. Unauthorized use is prohibited.</p>

                <h2>4. Data Protection</h2>
                <p>We comply with GDPR and other privacy regulations. For details, refer to our <a href="/privacy-policy">Privacy Policy</a>.</p>

                <h2>5. Contact</h2>
                <p>For legal inquiries, please contact us at <a href="mailto:legal@wayz.com">legal@wayz.com</a>.</p>
            </div>

            <Footer />
        </>
    );
};

export default LegalNotices;