import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminNav = () => (
    <Nav className="bg-light p-3">
        <Link to="/admin" className="nav-link">Admin Dashboard</Link>
        <Link to="/login" className="nav-link">Logout</Link>
    </Nav>
);

export default AdminNav;
