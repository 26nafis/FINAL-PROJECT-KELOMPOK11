import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '../utils/api';

const AuthContext = createContext(null);

/**
 * Backend pakai JWT (bukan session/cookie), jadi token disimpan di
 * localStorage dan dikirim lewat header Authorization: Bearer <token>
 * (sudah dihandle otomatis oleh utils/api.js -> getHeaders()).
 *
 * Saat app dimuat, kalau ada token tersimpan, kita validasi ke
 * GET /api/auth/me. Kalau token invalid/expired, otomatis logout.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await apiGet('/api/auth/me');
      setUser(res.data);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const res = await apiPost('/api/auth/login', { email, password });
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  /**
   * Registrasi publik SELALU sebagai customer, meskipun backend teknisnya
   * menerima field `role`. Akun admin sebaiknya dibuat manual (lewat
   * seeder/DB), bukan dari form publik, biar gak ada yang bisa
   * daftar jadi admin sendiri.
   */
  const register = async (name, email, password) => {
    await apiPost('/api/auth/register', { name, email, password, role: 'customer' });
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
