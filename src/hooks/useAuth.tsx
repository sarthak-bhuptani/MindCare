import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Clear old localStorage auth data to ensure logging out on close
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        const savedToken = sessionStorage.getItem('token');
        const savedUser = sessionStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = useCallback((newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('user', JSON.stringify(newUser));
    }, []);

    const navigate = useNavigate();

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        localStorage.removeItem('mindcare_onboarded');
        navigate('/');
    }, [navigate]);

    // Automatic logout due to inactivity
    useEffect(() => {
        const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutes
        let timeoutId: NodeJS.Timeout;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (token) {
                    logout();
                    toast.info("Session Expired", {
                        description: "You have been automatically logged out due to inactivity."
                    });
                }
            }, INACTIVITY_TIME);
        };

        if (token) {
            const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
            events.forEach(event => window.addEventListener(event, resetTimer));
            resetTimer();

            return () => {
                events.forEach(event => window.removeEventListener(event, resetTimer));
                if (timeoutId) clearTimeout(timeoutId);
            };
        }
    }, [token, logout]);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
