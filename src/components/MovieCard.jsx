import React from 'react';
import { Card, Button } from 'react-bootstrap';

const MovieCard = ({ movie, onEdit, onDelete }) => (
    <Card className="mb-3">
        <Card.Body>
            <Card.Title>{movie.title}</Card.Title>
            <Card.Text>
                <strong>Director:</strong> {movie.director} <br />
                <strong>Year:</strong> {movie.year} <br />
                <strong>Genre:</strong> {movie.genre} <br />
                <strong>Description:</strong> {movie.description}
            </Card.Text>
            <Button variant="primary" onClick={() => onEdit(movie)}>Edit</Button>
            <Button variant="danger" className="ms-2" onClick={() => onDelete(movie._id)}>Delete</Button>
        </Card.Body>
    </Card>
);

export default MovieCard;
