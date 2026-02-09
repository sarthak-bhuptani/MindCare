
// This file centralizes the backend API URL for easy deployment.
// On your local machine, it defaults to localhost:5000.
// When you deploy, you can change this to your production backend URL.

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export const API_ENDPOINTS = {
    AUTH: `${API_BASE_URL}/api/auth`,
    JOURNAL: `${API_BASE_URL}/api/journal`,
    CHAT: `${API_BASE_URL}/api/chat`,
    HEALTH: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL;
