import React, { useState, useEffect } from 'react';
import { Container, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/movies/getMovies`)
      .then(response => response.json())
      .then(data => setMovies(data.movies))
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  return (
    <Container>
      <h1>Movie List</h1>
      <ListGroup>
        {movies.map(movie => (
          <ListGroup.Item key={movie._id}>
            <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default MovieList;
