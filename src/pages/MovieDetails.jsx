// src/pages/MovieDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';

function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/movies/getMovie/${movieId}`)
      .then(response => response.json())
      .then(data => {
        if (data.status ===200) {
            console.log(data);
          setMovie(data.movie);
        } else {
          setError('Movie not found.');
          console.log(data);
        }
      })
      .catch(error => {
        setError('An error occurred while fetching movie details.');
        console.error('Error fetching movie details:', error);
      });
  }, [movieId]);

  if (error) {
    return <Container><p>{error}</p></Container>;
  }

  return (
    <Container>
        <Button
            onClick={() => navigate(-1)}
            variant="outline-secondary"
            size="sm"
            className='mt-3'
          >
            Back
          </Button>
        {movie ? (
            <Card className='mt-3'>
            <Card.Body className='my-3'>
                <h1>{movie.title} | {movie.year}</h1>
                <h4>{movie.director}</h4>
                <Card.Text>{movie.description}</Card.Text>
                <Card.Text>Genre: {movie.genre}</Card.Text>
                {/* Add more movie details here */}
            </Card.Body>
            </Card>
        ) : (
            <p>Loading...</p>
        )}
    </Container>
  );
}

export default MovieDetail;
