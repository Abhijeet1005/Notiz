import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get('/auth/me');
                setUser(res.data);
                setIsAuthenticated(true);
            } catch (err) {
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (username, password) => {
        const res = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', res.data.token);

        // Load user data immediately
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);
        setIsAuthenticated(true);
    };

    const register = async (username, password, email) => {
        const res = await api.post('/auth/register', { username, password, email });
        localStorage.setItem('token', res.data.token);

        // Load user data immediately
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);
        setIsAuthenticated(true);
    };

    const verifyEmail = async () => {
        await api.post('/auth/verify-email');
    };

    const validateOTP = async (otp) => {
        await api.post('/auth/validate-otp', { otp });
        // Refresh user data to update verification status
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, verifyEmail, validateOTP }}>
            {children}
        </AuthContext.Provider>
    );
};
