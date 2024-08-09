import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

// Import the components for admin and user here
import AdminDashboard from '../components/AdminDashboard';
import UserHomePage from '../components/MovieList';
import LogoutButton from '../components/LogoutButton'

const Homepage = () => {
  const [isAdmin, setIsAdmin] = useState(null);

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
        setIsAdmin(false); // Redirect or handle the invalid token case
      }
    } else {
      setIsAdmin(false); // Handle the case where no token is found
    }
  }, []);

  if (isAdmin === null) {
    // Optionally, you can add a loading state here
    return <div>Loading...</div>;
  }

  return (
    <div>
        <LogoutButton/>
        {isAdmin ? <AdminDashboard /> : <UserHomePage />}
    </div>
  );
};

export default Homepage;