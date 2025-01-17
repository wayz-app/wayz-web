import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <header className="sticky-header">
                <nav>
                    <ul>
                        <li onClick={() => navigate('/')}>Accueil</li>
                        <li onClick={() => navigate('/about')}>À propos</li>
                        <li onClick={() => navigate('/contact')}>Contact</li>
                    </ul>
                </nav>
            </header>
            <div className="home-background">
                <div className="home-content">
                    <h1>Bienvenue à Caen</h1>
                    <p>Découvrez notre contenu par-dessus une belle carte !</p>
                </div>
            </div>
        </>
    );
};

export default Home;
