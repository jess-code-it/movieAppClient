import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Form, Alert, Modal, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [currentComment, setCurrentComment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setError('You need to be logged in to view the movie list.');
      navigate('/login');
      return;
    } else {
        const decodeToken = jwtDecode(token);
        setCurrentUser(decodeToken);
        console.log(decodeToken);
    }
    // Fetch movie data
    fetch(`${import.meta.env.VITE_API_URL}/movies/getMovies`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.movies) {
          setMovies(data.movies);
          setError('');
        } else {
          setError('Failed to fetch movies.');
        }
      })
      .catch(error => {
        setError('An error occurred while fetching movies.');
        console.error('Error fetching movies:', error);
      });
  }, [navigate]);

  useEffect(() => {
    if (currentMovie && currentMovie._id) {
        fetch(`${import.meta.env.VITE_API_URL}/movies/getComments/${currentMovie._id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.comments) {
                setCurrentMovie(prevMovie => ({
                    ...prevMovie,
                    comments: data.comments
                }));
            } else {
                setError('Failed to fetch comments.');
            }
        })
        .catch(error => {
            setError('An error occurred while fetching comments.');
            console.error('Error fetching comments:', error);
        });
    }
}, [currentMovie]);


  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setCurrentUser(null);
    navigate('/login');
  };

  const handleAddMovie = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setError('You need to be logged in to add a movie.');
      navigate('/login');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/movies/addMovie`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, director, year, description, genre }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.result) {
          setMovies([...movies, data.result]);
          setTitle('');
          setDirector('');
          setYear('');
          setDescription('');
          setGenre('');
          setShowAddModal(false);
          Swal.fire({
            title: "Movie added successfully!",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Failed to add movie.",
            icon: "error",
          });
        }
      })
      .catch(error => {
        Swal.fire({
          title: "An error occurred while adding the movie.",
          icon: "warning",
        });
      });
  };

  const handleUpdateMovie = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setError('You need to be logged in to update a movie.');
      navigate('/login');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/movies/updateMovie/${currentMovie._id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, director, year, description, genre }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.updatedMovie) {
          const updatedMovies = movies.map(movie => movie._id === currentMovie._id ? data.updatedMovie : movie);
          setMovies(updatedMovies);
          setCurrentMovie(null);
          setTitle('');
          setDirector('');
          setYear('');
          setDescription('');
          setGenre('');
          Swal.fire({
            title: "Movie updated successfully!",
            icon: "success",
          });
          setShowUpdateModal(false);
        } else {
          Swal.fire({
            title: "Failed to update movie.",
            icon: "error",
          });
        }
      })
      .catch(error => {
        Swal.fire({
          title: "An error occurred while updating the movie.",
          icon: "warning",
        });
        console.error('Error updating movie:', error);
      });
  };

  const handleDeleteMovie = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setError('You need to be logged in to delete a movie.');
      navigate('/login');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/movies/deleteMovie/${currentMovie._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "Movie deleted successfully") {
          const updatedMovies = movies.filter(movie => movie._id !== currentMovie._id);
          setMovies(updatedMovies);
          setCurrentMovie(null);
          Swal.fire({
            title: "Movie deleted successfully!",
            icon: "success",
          });
          setShowDeleteModal(false);
        } else {
          Swal.fire({
            title: "Failed to delete movie.",
            icon: "error",
          });
        }
      })
      .catch(error => {
        Swal.fire({
          title: "An error occurred while deleting the movie.",
          icon: "warning",
        });
        console.error('Error deleting movie:', error);
      });
  };

  const handleAddComment = () => {
    const token = localStorage.getItem('accessToken');
  
    if (!token) {
      setError('You need to be logged in to add a comment.');
      navigate('/login');
      return;
    }
    console.log(currentMovie);
    if (!currentMovie || !currentMovie._id) {
      Swal.fire({
        title: "No movie selected.",
        icon: "error",
      });
      return;
    }
  
    fetch(`${import.meta.env.VITE_API_URL}/movies/addComment/${currentMovie._id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: comment }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.comment) {
        const updatedMovies = movies.map(movie =>
          movie._id === currentMovie._id
            ? {
                ...movie,
                comments: [...movie.comments, data.comment],
              }
            : movie
        );
        setMovies(updatedMovies);
        setComment('');
        setShowComments(prevState => ({ ...prevState, [currentMovie._id]: false }));
        Swal.fire({
          title: "Comment added successfully!",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Failed to add comment.",
          icon: "error",
        });
      }
    })
    .catch(error => {
      Swal.fire({
        title: "An error occurred while adding the comment.",
        icon: "warning",
      });
      console.error('Error adding comment:', error);
    });
  };
  

  const toggleShowComments = movieId => {
    setShowComments(prevState => ({ 
      ...prevState, 
      [movieId]: !prevState[movieId] 
    }));
  };

  const handleViewMovie = (movieId) => {
    fetch(`${import.meta.env.VITE_API_URL}/movies/getMovie/${movieId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log("getMovie:", data);
        if (data.movie) {
            setCurrentMovie(data.movie);
        } else {
            console.log("getMovie error:", data);
            setError('Failed to fetch movie details.');
        }
    })
    .catch(error => {
        setError('An error occurred while fetching movie details.');
        console.error('Error fetching movie details:', error);
    });
};

useEffect(() => {
    if (currentMovie) {
        navigate(`/movies/getMovie/${currentMovie._id}`);
    }
}, [currentMovie, navigate]);


  return (
    <Container>
      <Button variant="link" onClick={handleLogout} className="mb-3 float-end">
        Logout
      </Button>
      <h1>Movie List</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {currentUser && currentUser.isAdmin && (
        <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Movie</Button>
      )}
      {movies.map(movie => (
        <Card key={movie._id} className="my-3">
          <Card.Body>
            <Card.Title>{movie.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{movie.director} ({movie.year})</Card.Subtitle>
            <Card.Text>{movie.description}</Card.Text>
            <Card.Text><strong>Genre:</strong> {movie.genre}</Card.Text>
            <Button variant="info" onClick={() => handleViewMovie(movie._id)}>View Details</Button>
            {currentUser && currentUser.isAdmin && (
              <>
                <Button variant="secondary" onClick={() => {
                  setCurrentMovie(movie);
                  setTitle(movie.title);
                  setDirector(movie.director);
                  setYear(movie.year);
                  setDescription(movie.description);
                  setGenre(movie.genre);
                  setShowUpdateModal(true);
                }}>Edit</Button>
                <Button variant="danger" className="mx-2" onClick={() => {
                  setCurrentMovie(movie);
                  setShowDeleteModal(true);
                }}>Delete</Button>
              </>
            )}
            <Button onClick={() => toggleShowComments(movie._id)} aria-controls={`comments-${movie._id}`} aria-expanded={showComments[movie._id] || false}>
              {showComments[movie._id] ? 'Hide Comments' : 'Show Comments'}
            </Button>
            <Collapse in={showComments[movie._id]}>
            <div id={`comments-${movie._id}`}>
                {movie.comments && movie.comments.length > 0 ? (
                    movie.comments.map(comment => (
                        <Card key={comment._id} className="my-2">
                            <Card.Body>

                                <Card.Text className='ms-3'>Comment: {comment.comment}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <Card className="my-2">
                        <Card.Body>
                            <Card.Text>No comments found.</Card.Text>
                        </Card.Body>
                    </Card>
                )}
                {currentUser && (
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        setCurrentMovie(movie);
                        handleAddComment();
                    }}>
                    <Form.Group controlId="commentInput">
                    <Form.Control type="text" placeholder="Add a comment" value={comment} onChange={e => setComment(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="my-2">Add Comment</Button>
                </Form>
                )}
</div>
            </Collapse>
          </Card.Body>
        </Card>
      ))}
      {/* Add Movie Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            handleAddMovie();
          }}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="director">
              <Form.Label>Director</Form.Label>
              <Form.Control type="text" value={director} onChange={e => setDirector(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="year">
              <Form.Label>Year</Form.Label>
              <Form.Control type="number" value={year} onChange={e => setYear(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="genre">
              <Form.Label>Genre</Form.Label>
              <Form.Control type="text" value={genre} onChange={e => setGenre(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="my-2">Add Movie</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Update Movie Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            handleUpdateMovie();
          }}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="director">
              <Form.Label>Director</Form.Label>
              <Form.Control type="text" value={director} onChange={e => setDirector(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="year">
              <Form.Label>Year</Form.Label>
              <Form.Control type="number" value={year} onChange={e => setYear(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="genre">
              <Form.Label>Genre</Form.Label>
              <Form.Control type="text" value={genre} onChange={e => setGenre(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="my-2">Update Movie</Button>
          </Form>
        </Modal.Body>
      </Modal>

       {/* Delete Movie Modal */}
       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this movie?</p>
          <Button variant="danger" onClick={handleDeleteMovie}>Delete</Button>
        </Modal.Body>
      </Modal>
    </Container>

  );
};

export default MovieList;
