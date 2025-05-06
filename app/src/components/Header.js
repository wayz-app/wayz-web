import React, { useEffect, useState } from 'react';
import '../css/Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); 
    }, []);

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-name" onClick={() => navigate('/')}>Wayz</div>
                
                <div className="header-links">
                    <nav>
                        <ul>
                            <li onClick={() => navigate('/')}>Home</li>
                            <li onClick={() => navigate('/about')}>About</li>
                            <li onClick={() => navigate('/navigate')}>Navigate</li>
                        </ul>
                    </nav>
                    
                    {isLoggedIn ? (
                        <button 
                            className="header-profile"
                            onClick={() => navigate('/dashboard')}
                        >
                            My Profile
                        </button>
                    ) : (
                        <button 
                            className="header-login"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;