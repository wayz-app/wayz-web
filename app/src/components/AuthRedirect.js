import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, location.pathname);
      navigate('/dashboard');
    } else {
      console.log('No token found, redirecting to home');
      navigate('/');
    }
  }, [navigate, location]);
  
  return <div>Processing authentication...</div>;
};

export default AuthRedirect;