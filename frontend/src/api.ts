import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = {
    createSession: async (qubitCount: number, threshold: number, eveEnabled: boolean) => {
        const res = await axios.post(`${API_BASE}/session/create`, {
            qubit_count: qubitCount,
            qber_threshold: threshold,
            eve_enabled: eveEnabled
        });
        return res.data;
    },

    startBB84: async (sessionId: string) => {
        const res = await axios.post(`${API_BASE}/bb84/start`, { session_id: sessionId });
        return res.data;
    },

    encryptFile: async (sessionId: string, file: File) => {
        const formData = new FormData();
        formData.append('session_id', sessionId);
        formData.append('file', file);

        // Allow axios to set content-type boundary automatically
        const res = await axios.post(`${API_BASE}/transfer/encrypt`, formData);
        return res.data;
    },

    decryptFile: async (sessionId: string, transferId: string) => {
        const res = await axios.post(`${API_BASE}/transfer/decrypt`, {
            session_id: sessionId,
            transfer_id: transferId
        });
        return res.data;
    },

    getSessionInfo: async (sessionId: string) => {
        const res = await axios.get(`${API_BASE}/session/${sessionId}`);
        return res.data;
    },

    getHistory: async () => {
        const res = await axios.get(`${API_BASE}/transfer/history`);
        return res.data.history;
    },

    getStats: async () => {
        const res = await axios.get(`${API_BASE}/transfer/stats`);
        return res.data;
    }
};
