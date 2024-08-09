import React, { useState, useEffect } from 'react';
import { Container, Button, Form, ListGroup, Alert, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: '',
    director: '',
    year: '',
    description: '',
    genre: ''
  });
  const [editMovie, setEditMovie] = useState(null);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showAddModal, setShowAddModal] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/movies/getMovies`)
      .then(response => response.json())
      .then(data => {
        // Ensure comments is an array for each movie
        const updatedMovies = data.movies.map(movie => ({
          ...movie,
          comments: movie.comments || [] // Ensure comments is an array
        }));
        setMovies(updatedMovies);
      })
      .catch(error => setError('Error fetching movies'));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/movies/getMovies`)
      .then(response => response.json())
      .then(data => setMovies(data.movies || []))
      .catch(error => setError('Error fetching movies'));
  }, []);

  const handleAddMovie = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/movies/addMovie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(newMovie)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (Object.keys(data).length > 0) {
          setMovies([...movies, data.newMovie]);
          setNewMovie({ title: '', director: '', year: '', description: '', genre: '' });
          setShowAddModal(false);
          Swal.fire({
            title: 'Success!',
            text: 'Add movie successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          console.error('Failed to add movie');
          Swal.fire({
            title: 'Error!',
            text: data.message || 'Failed to delete movie',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      })
      .catch(error => console.error('Error connecting to server'));
  };

  const handleDeleteMovie = () => {
    fetch(`${import.meta.env.VITE_API_URL}/movies/deleteMovie/${selectedMovie._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "Movie deleted successfully") {
          setMovies(movies.filter(movie => movie._id !== selectedMovie._id));
          setShowDeleteModal(false);
          Swal.fire({
            title: 'Success!',
            text: 'Movie deleted successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.message || 'Failed to delete movie',
                icon: 'error',
                confirmButtonText: 'OK'
              });
        }
      })
      .catch(error => setError('Error connecting to server'));
  };

  const handleUpdateMovie = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/movies/updateMovie/${editMovie._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(editMovie)
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "Movie updated successfully") {
          setMovies(movies.map(movie => movie._id === data.updatedMovie._id ? data.updatedMovie : movie));
          setShowEditModal(false);
          setEditMovie(null);
          Swal.fire({
            title: 'Success!',
            text: 'Movie updated successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          setError(data.message || 'Failed to update movie');
        }
      })
      .catch(error => setError('Error connecting to server'));
  };

  const handleAddComment = (movieId) => {
    fetch(`${import.meta.env.VITE_API_URL}/movies/addComment/${movieId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ content: newComment })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.comment) {
          setMovies(movies.map(movie => 
            movie._id === movieId 
            ? { ...movie, comments: [...movie.comments, data.comment] }
            : movie
          ));
          setNewComment('');
        } else {
          setError(data.message || 'Failed to add comment');
        }
      })
      .catch(error => setError('Error connecting to server'));
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      <h1>Admin Dashboard</h1>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>
        Add Movie
      </Button>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMovie}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter movie title"
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDirector">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter movie director"
                value={newMovie.director}
                onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formYear">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter movie release year"
                value={newMovie.year}
                onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter movie description"
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGenre">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter movie genre"
                value={newMovie.genre}
                onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Movie
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <h2 className="mt-4">Movies</h2>
      <ListGroup>
  {movies && movies.length > 0 ? (
    movies.map(movie => (
      movie ? (
        <ListGroup.Item key={movie._id}>
          <h5>{movie.title || 'No Title'}</h5>
          <p><strong>Director:</strong> {movie.director || 'Unknown'}</p>
          <p><strong>Year:</strong> {movie.year || 'N/A'}</p>
          <p><strong>Description:</strong> {movie.description || 'No Description'}</p>
          <p><strong>Genre:</strong> {movie.genre || 'Unknown'}</p>
          <Button
            variant="danger"
            className='me-3'
            onClick={() => {
              setSelectedMovie(movie);
              setShowDeleteModal(true);
            }}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            className="ml-2"
            onClick={() => {
              setEditMovie(movie);
              setShowEditModal(true);
            }}
          >
            Update
          </Button>
          {/* Comments Section */}
          <h4 className="mt-3">Comments</h4>
          <Form.Group controlId={`formNewComment-${movie._id}`}>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button 
              variant="primary" 
              onClick={() => handleAddComment(movie._id)} 
              className="mt-2"
            >
              Add Comment
            </Button>
          </Form.Group>
          <ListGroup>
            {(movie.comments || []).map(comment => (
              comment ? (
                <ListGroup.Item key={comment._id}>
                  <p>{new Date(comment.createdAt).toLocaleString()}</p>
                  <p>{comment.comment || 'No Content'}</p>
                </ListGroup.Item>
              ) : null
            ))}
          </ListGroup>
        </ListGroup.Item>
      ) : (
        <ListGroup.Item key={`placeholder-${Math.random()}`}>
          <p>Movie data is missing or undefined.</p>
        </ListGroup.Item>
      )
    ))
  ) : (
    <p>No movies available</p>
  )}
</ListGroup>


      {/* Edit Movie Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Edit Movie</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {editMovie && (
      <Form onSubmit={handleUpdateMovie}>
        <Form.Group controlId="formEditTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter movie title"
            value={editMovie.title}
            onChange={(e) => setEditMovie({ ...editMovie, title: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formEditDirector">
          <Form.Label>Director</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter movie director"
            value={editMovie.director}
            onChange={(e) => setEditMovie({ ...editMovie, director: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formEditYear">
          <Form.Label>Year</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter movie release year"
            value={editMovie.year}
            onChange={(e) => setEditMovie({ ...editMovie, year: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formEditDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter movie description"
            value={editMovie.description}
            onChange={(e) => setEditMovie({ ...editMovie, description: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formEditGenre">
          <Form.Label>Genre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter movie genre"
            value={editMovie.genre}
            onChange={(e) => setEditMovie({ ...editMovie, genre: e.target.value })}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Update Movie</Button>
      </Form>
    )}
  </Modal.Body>
</Modal>

      {/* Delete Movie Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this movie?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteMovie}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
