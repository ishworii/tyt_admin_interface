import axios from 'axios';
import { useState } from 'react';

// Create axios instance with default config
export const api = axios.create({
    baseURL: 'http://localhost:8000', // Your backend URL
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const login = (data) => api.post('/user/login', data);
export const logout = () => api.post('/user/logout');
export const registerUser = (data) => api.post('/api/admin/register', data);

// Users endpoints
export const getUsers = () => api.get('api/admin/getAllUser');
// export const updateUser = (id, data) => api.put(`/api/admin/users/${id}`, data);
// export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);
export const changePassword = (data) => api.put('/user/profile/password', data);

// Rules endpoints
export const getRules = () => api.get('api/admin/allrules');
export const createRule = (data) => api.post('/api/admin/rules', data);
export const updateRule = (id, data) => api.put(`/api/admin/rules/${id}`, data);
export const deleteRule = (id) => api.delete(`/api/admin/rules/${id}`);

// Records endpoints
export const getRecords = () => api.get('/pedrecord/getAllPedRecord');
export const createRecord = (data) => api.post('/pedrecord', data);
export const updateRecord = (id, data) => api.patch(`/pedrecord/${id}`, data);
export const deleteRecord = (id) => api.delete(`/pedrecord/${id}`);
export const searchRecord = (licenseNumber) => api.get(`searchRecords/search/${licenseNumber}`);

// Profile endpoints
export const getProfile = () => api.get('/user/profile');
export const updateProfile = (data) => api.put('/user/profile', data);

// Error handler helper
export const handleApiError = (error) => {
    if (error.response) {
        return error.response.data.message || 'An error occurred';
    } else if (error.request) {
        return 'No response from server';
    } else {
        return 'Error setting up request';
    }
};

// Custom hook for API calls with loading and error states
export const useApiCall = (apiFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = async (...params) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiFunction(...params);
            setData(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { execute, data, loading, error };
};

export default api;
