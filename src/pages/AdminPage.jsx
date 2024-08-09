import React from 'react';
import MovieList from '../components/MovieList';
import AdminNav from '../components/AdminNav';

const AdminPage = () => (
    <div>
        <h1>Admin</h1>
        <AdminNav />
        <h1>Admin Dashboard</h1>
        <MovieList />
    </div>
);

export default AdminPage;
