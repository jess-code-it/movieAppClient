import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminDashboard from '../components/AdminDashboard';
import UserHomePage from '../components/MovieList';
import LogoutButton from '../components/LogoutButton';

const Homepage = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const adminStatus = decodedToken.isAdmin;
        setIsAdmin(adminStatus);
      } catch (err) {
        console.error('Token decoding failed:', err);
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <LogoutButton />
        {isAdmin ? <AdminDashboard /> : <UserHomePage />}
    </div>
  );
};

export default Homepage;
