import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user'));

  return token && user && user.isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
