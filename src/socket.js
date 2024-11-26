// src/socket.js
import { io } from 'socket.io-client';

export const initSocket = async () => {
    try {
        const options = {
            'force new connection': true,
            reconnectionAttempts: 'Infinity',
            timeout: 10000,
            transports: ['websocket'],
        };

        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        console.log('Connecting to backend URL:', backendUrl);
        
        return io(backendUrl, options);
    } catch (error) {
        console.error('Socket initialization error:', error);
        throw error;
    }
};