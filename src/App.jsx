import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieList from './pages/MovieList';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import MovieDetail from './pages/MovieDetails'; // Import MovieDetail
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/movies/:movieId" element={<MovieDetail />} /> {/* Add this route */}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
