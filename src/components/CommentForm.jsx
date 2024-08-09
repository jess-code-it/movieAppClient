import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const CommentForm = ({ movieId, onSubmit }) => {
    const [text, setText] = useState('');

    const handleChange = (e) => setText(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/movies/addComment/${movieId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
            credentials: 'include'
        })
            .then(response => response.json())
            .then(() => {
                setText('');
                onSubmit();
            })
            .catch(error => console.error('Error adding comment:', error));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formComment">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                    as="textarea"
                    value={text}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Add Comment
            </Button>
        </Form>
    );
};

export default CommentForm;
