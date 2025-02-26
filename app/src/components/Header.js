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
        <header className="sticky-header">
            <nav>
                <ul>
                    <li onClick={() => navigate('/')}>Home</li>
                    <li onClick={() => navigate('/about')}>About</li>
                    <li onClick={() => navigate('/navigate')}>Navigate</li>
                    <li onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}>
                        {isLoggedIn ? 'Dashboard' : 'Login'}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;