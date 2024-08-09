import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';

const CommentList = ({ movieId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch(`/movies/getComments/${movieId}`)
            .then(response => response.json())
            .then(data => setComments(data.comments))
            .catch(error => console.error('Error fetching comments:', error));
    }, [movieId]);

    return (
        <ListGroup>
            {comments.map(comment => (
                <ListGroup.Item key={comment._id}>
                    {comment.text}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default CommentList;
