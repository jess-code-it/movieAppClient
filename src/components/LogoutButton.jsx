import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Button variant="secondary" className='float-end me-3 mt-2' onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
