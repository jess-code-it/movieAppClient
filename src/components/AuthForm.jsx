import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AuthForm = ({ isLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isLogin ? `${import.meta.env.VITE_API_URL}/users/login` : `${import.meta.env.VITE_API_URL}/users/register`;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        setLoading(false);
        if (isLogin) {
            console.log(data);
          if (data.access) {
            localStorage.setItem('authToken', data.access);
            const decodedToken = jwtDecode(data.access);
            const isAdmin = decodedToken.isAdmin;
            console.log(isAdmin);
            // Navigate based on user role
            if (isAdmin) {
              navigate('/admin'); // Redirect to admin dashboard
            } else {
              navigate('/'); // Redirect to user home page
            }
          } else {
            setError(data.message || 'An error occurred');
          }
        } else {
          // Registration successful
          if (data.message === 'User registered successfully') {
            navigate('/login'); // Redirect to login page after successful registration
          } else {
            setError(data.message || 'An error occurred');
          }
        }
      })
      .catch(err => {
        setLoading(false);
        setError('Failed to connect to the server');
        console.error('Fetch Error:', err);
      });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {isLogin ? 'Login' : 'Register'}
        </Button>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Form>
    </Container>
  );
};

export default AuthForm;
