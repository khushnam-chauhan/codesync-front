import { io } from 'socket.io-client';

export const initSocket = async () => {
  const options = {
    forceNew: true,
    reconnectionAttempts: 5,
    timeout: 10000,
    transports: ['websocket']
  };
  return io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', options);
};