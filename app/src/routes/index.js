import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../views/Home';
import About from '../views/About';
import Login from '../views/Login';
import Navigation from '../views/Navigation';
import Register from '../views/Register';
import Profile from '../views/Profile';
import Statistics from '../views/Statistics';
import Dashboard from '../views/Dashboard';
import LegalNotices from '../components/LegalNotices';
import TermsOfService from '../components/TermsOfService';
import PrivacyPolicy from '../components/PrivacyPolicy';
import PrivateRoute from '../components/PrivateRoute';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                
                {/* Route protégée par le token */}
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
                
                <Route 
                    path="/profile" 
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } 
                />
               
                <Route 
                    path="/statistics" 
                    element={
                        <PrivateRoute>
                            <Statistics />
                        </PrivateRoute>
                    } 
                />

                <Route path="/navigate" element={<Navigation />} />
                <Route path="/legal-notices" element={<LegalNotices />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;