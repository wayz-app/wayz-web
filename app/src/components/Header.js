import React, { useEffect, useState } from 'react';
import '../css/Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); 
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-name" onClick={() => handleNavigation('/')}>
                    Wayz
                </div>
                
                <div className={`hamburger-menu ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                
                <div className={`header-links ${menuOpen ? 'active' : ''}`}>
                    <nav>
                        <ul>
                            <li onClick={() => handleNavigation('/')}>Home</li>
                            <li onClick={() => handleNavigation('/about')}>About</li>
                            <li onClick={() => handleNavigation('/navigate')}>Navigate</li>
                        </ul>
                    </nav>
                    
                    {isLoggedIn ? (
                        <button 
                            className="header-profile"
                            onClick={() => handleNavigation('/dashboard')}
                        >
                            My Profile
                        </button>
                    ) : (
                        <button 
                            className="header-login"
                            onClick={() => handleNavigation('/login')}
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