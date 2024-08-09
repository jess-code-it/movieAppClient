import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const validateToken = () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // Check if the token is expired
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('authToken');
                    setIsAuthenticated(false);
                    setUser(null);
                } else {
                    setIsAuthenticated(true);
                    setUser(decodedToken.user); // Assuming the token payload has user data
                }
            } catch (error) {
                console.error('Invalid token:', error);
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        validateToken();
    }, []);

    return { isAuthenticated, user };
};
