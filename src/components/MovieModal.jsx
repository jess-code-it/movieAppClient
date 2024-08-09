import React from 'react';
import { Modal } from 'react-bootstrap';
import MovieForm from './MovieForm';

const MovieModal = ({ show, movie, onSubmit, onHide }) => (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>{movie ? 'Edit Movie' : 'Add Movie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <MovieForm movie={movie} onSubmit={onSubmit} onCancel={onHide} />
        </Modal.Body>
    </Modal>
);

export default MovieModal;
