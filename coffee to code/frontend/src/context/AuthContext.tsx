import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '../utils/api';
import { connectSocket, disconnectSocket } from '../utils/socket';
import { User, UserRole } from '../types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  register: (data: Partial<User> & { password?: string }) => Promise<User>;
  logout: () => void;
  isRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('campus_token'));

  // Initialize user from stored token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('campus_token');
      const storedUser = localStorage.getItem('campus_user');

      if (storedToken && storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          connectSocket(parsedUser);
        } catch {
          localStorage.removeItem('campus_token');
          localStorage.removeItem('campus_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password?: string): Promise<User> => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('campus_token', newToken);
    localStorage.setItem('campus_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    connectSocket(newUser);
    return newUser;
  }, []);

  const register = useCallback(async (data: Partial<User> & { password?: string }): Promise<User> => {
    const response = await api.post('/auth/register', data);
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('campus_token', newToken);
    localStorage.setItem('campus_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    connectSocket(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('campus_token');
    localStorage.removeItem('campus_user');
    setToken(null);
    setUser(null);
    disconnectSocket();
  }, []);

  const isRole = useCallback((...roles: UserRole[]): boolean => {
    return !!(user && roles.includes(user.role));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
