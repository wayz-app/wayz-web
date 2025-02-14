import React from 'react';
import '../css/Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="sticky-header">
            <nav>
                <ul>
                    <li onClick={() => navigate('/')}>Home</li>
                    <li onClick={() => navigate('/about')}>About</li>
                    <li onClick={() => navigate('/login')}>Login</li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;