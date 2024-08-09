import React, { useState, useEffect } from 'react';
import { Container, Button, Form, ListGroup, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  console.log("Movie ID", movie)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/movies/getMovie/${movieId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching movie details');
        }
        return response.json();
      })
      .then(data => {
        setMovie(data);
      })
      .catch(error => setError(error.message || 'Error fetching movie details'));
  }, [movieId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/movies/addComment/${movieId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ text: comment })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error adding comment');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.updatedMovie) {
          setMovie(data.updatedMovie);
          setComment('');
        } else {
          console.log("Data:",data);
          console.log("Error",data.error);
          setError(data.message || 'Failed to add comment');
        }
      })
      .catch(error => setError(error.message || 'Error connecting to server'));
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {movie ? (
        <>
          <h1>{movie.title}</h1>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Year:</strong> {movie.year}</p>
          <p><strong>Description:</strong> {movie.description}</p>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <h2>Comments</h2>
          <ListGroup>
            {movie.comments.map((c, index) => (
              <ListGroup.Item key={index}>
                <p>{new Date(c.createdAt).toLocaleString()}</p>
                <p>{c.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Form onSubmit={handleCommentSubmit} className="mt-3">
            <Form.Group controlId="formComment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Add Comment</Button>
          </Form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default MovieDetail;
