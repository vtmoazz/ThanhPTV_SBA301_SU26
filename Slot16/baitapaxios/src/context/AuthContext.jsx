import { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/userApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Khôi phục session khi app khởi động bằng cách đọc từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('current_user');
    if (saved) setCurrentUser(JSON.parse(saved));
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError('');
    try {
      const { account, user } = await authApi.login(username, password);
      const session = { ...user, role: account.role };
      setCurrentUser(session);
      localStorage.setItem('current_user', JSON.stringify(session));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
