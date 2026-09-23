import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('blog_admin_token'));
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem('blog_admin_profile');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('blog_admin_token', token);
    else localStorage.removeItem('blog_admin_token');
  }, [token]);

  useEffect(() => {
    if (admin) localStorage.setItem('blog_admin_profile', JSON.stringify(admin));
    else localStorage.removeItem('blog_admin_profile');
  }, [admin]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.data.token);
    setAdmin(data.data.admin);
    return data.data;
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, isAuthed: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};