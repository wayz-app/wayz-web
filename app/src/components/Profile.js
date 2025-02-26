import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/Profile.css';
import '../css/Breadcrumb.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const id = decoded.sub;
                setUserId(id);
                fetchUserData(id, token);
            } catch (error) {
                console.error('Failed to decode token:', error);
                handleInvalidToken();
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchUserData = async (id, token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.status === 401 && data.detail === 'Invalid token') {
                handleInvalidToken();
                return;
            }

            if (response.ok) {
                setUser(data.data);
                setFormData({ username: data.data.username, email: data.data.email });
            } else {
                setErrorMessage(data.message || 'Failed to fetch user information.');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setErrorMessage('An error occurred while fetching user information.');
        }
    };

    const handleInvalidToken = () => {
        localStorage.removeItem('token');
        setErrorMessage('Session expired. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleEditProfile = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser((prev) => ({ ...prev, ...data.data })); // Mise à jour locale
                setIsModalOpen(false);
                window.location.reload(); // 🔄 Recharge la page après la sauvegarde
            } else {
                setErrorMessage(data.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setErrorMessage('An error occurred while updating user information.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Header />
            <div className="profile-content">
                <div className="breadcrumb">
                    <span onClick={() => navigate('/dashboard')} className="breadcrumb-link">Dashboard</span>
                    <span className="breadcrumb-separator"> / </span>
                    <span onClick={() => navigate('/profile')} className="breadcrumb-link">Profile</span>
                </div>

                <div className="profile-card">
                    <h1>👤 Profile</h1>

                    {errorMessage && <div className="error-message">⚠️ {errorMessage}</div>}

                    {user ? (
                        <div className="user-details">
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                    ) : (
                        <p>Loading user information...</p>
                    )}

                    <div className="profile-actions">
                        <button className="edit-button" onClick={handleEditProfile}>Edit Profile</button>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>

            {/* MODALE D'ÉDITION */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Profile</h2>
                        <div className="modal-body">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={handleCloseModal} disabled={isSaving}>Cancel</button>
                            <button className="save-button" onClick={handleSaveChanges} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default Profile;