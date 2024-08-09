import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieDetail from './pages/MovieDetail';
import { useAuth } from './hooks/useAuth';

const App = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={isAuthenticated && user && user.isAdmin ? <AdminPage /> : <Navigate to="/" />} />
                <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
                <Route path="/movies/:movieId" element={<MovieDetail />} />
            </Routes>
        </Router>
    );
};

export default App;
