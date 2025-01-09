import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role) {
            setIsAuthenticated(true);
            setUserRole(role);
        }
    }, []);

    const login = (response) => {
        setIsAuthenticated(true);
        setUserRole(response.role);
        localStorage.setItem('userRole', response.role);
    };

    const logout = async () => {
        try {
            await api.post('/user/logout'); // Update to match your backend endpoint
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsAuthenticated(false);
            setUserRole(null);
            localStorage.removeItem('userRole');
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                isAuthenticated, 
                userRole, 
                login, 
                logout,
                setUserRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
