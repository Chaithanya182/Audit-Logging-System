const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchLogs = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/logs?${query}`);
    return response.json();
};

export const fetchFilterOptions = async () => {
    const response = await fetch(`${API_BASE}/logs/options`);
    return response.json();
};

export const exportLogs = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    window.open(`${API_BASE}/logs/export?${query}`, '_blank');
};

export const callSampleEndpoint = async (endpoint, method = 'GET', body = null) => {
    const options = { method };
    if (body) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_BASE}/sample${endpoint}`, options);
    return response.json();
};
