import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful!');
                setEmail('');
                setPassword('');
                setError('');
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Error:', err);
        }
    };

    return (
        <Container>
            <h1 className="my-4">Register</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4">
                    Register
                </Button>
            </Form>

            {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
            {success && <Alert variant="success" className="mt-4">{success}</Alert>}
        </Container>
    );
};

export default RegisterPage;
