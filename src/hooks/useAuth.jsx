import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const response = await fetch('/auth/status', { credentials: 'include' });
                const data = await response.json();
                setIsAuthenticated(data.isAuthenticated);
                setUser(data.user);
            } catch (error) {
                console.error('Error fetching authentication status:', error);
            }
        };

        fetchAuthStatus();
    }, []);

    return { isAuthenticated, user };
};
