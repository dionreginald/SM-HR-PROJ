import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove admin info from localStorage
    localStorage.removeItem('admin');
    // Redirect to login page
    navigate('/login', { replace: true });
  }, [navigate]);

  // Optionally render null if you don't want to show anything
  return <p>Logging out...</p>;
}
