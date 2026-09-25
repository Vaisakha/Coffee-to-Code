import { io, Socket } from 'socket.io-client';
import { User } from '../types';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

export const connectSocket = (user?: Partial<User> | null): Socket => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    s.on('connect', () => {
      console.log('[Socket] Connected:', s.id);
      if (user) {
        s.emit('join_role', {
          role: user.role,
          userId: user._id || user.id,
          block: user.block,
        });
      }
    });
  }
  return s;
};

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};

export default getSocket;
