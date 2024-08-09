import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const MovieForm = ({ movie, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        director: '',
        year: '',
        description: '',
        genre: ''
    });

    useEffect(() => {
        if (movie) {
            setFormData({
                title: movie.title || '',
                director: movie.director || '',
                year: movie.year || '',
                description: movie.description || '',
                genre: movie.genre || ''
            });
        }
    }, [movie]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formDirector">
                <Form.Label>Director</Form.Label>
                <Form.Control
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formYear">
                <Form.Label>Year</Form.Label>
                <Form.Control
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formGenre">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                {movie ? 'Update Movie' : 'Add Movie'}
            </Button>
            <Button variant="secondary" className="ms-2" onClick={onCancel}>
                Cancel
            </Button>
        </Form>
    );
};

export default MovieForm;
