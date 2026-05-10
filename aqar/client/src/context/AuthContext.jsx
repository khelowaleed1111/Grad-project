import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load user from token on mount ──────────
  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('aqar_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await authApi.getMe();
      if (data.success) {
        persist(data.data, storedToken);
      } else {
        // Invalid token, clear storage
        logout();
      }
    } catch (error) {
      // Token validation failed, clear storage
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Initialise from localStorage ──────────
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ── Handle 401 from axiosInstance ─────────
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('aqar:unauthorized', handler);
    return () => window.removeEventListener('aqar:unauthorized', handler);
  }, []);

  const persist = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('aqar_token', tokenData);
    localStorage.setItem('aqar_user', JSON.stringify(userData));
  };

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password });
    persist(data.data.user, data.data.token);
    return data.data.user;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await authApi.register(formData);
    persist(data.data.user, data.data.token);
    return data.data.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aqar_token');
    localStorage.removeItem('aqar_user');
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('aqar_user', JSON.stringify(updatedUser));
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    loadUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
