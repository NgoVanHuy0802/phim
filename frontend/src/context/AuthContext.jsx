import { createContext, useContext, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const user = useMemo(() => {
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      return null;
    }
  }, [token]);

  const login = async (credentials) => {
    // Gọi endpoint /login (baseURL đang là /api)
    const response = await api.post('/login', credentials);
    const nextToken = response?.data?.data?.token;

    if (!nextToken) {
      throw new Error('Token không hợp lệ từ server.');
    }

    localStorage.setItem('token', nextToken);
    setToken(nextToken);
    return nextToken;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
