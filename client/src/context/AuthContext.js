import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data.user);
        setIsAuth(true);
      })
      .catch(() => {
        clearAuth();
      });
    }
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuth(false);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      localStorage.setItem('token', res.data.token);
      setUser({ email });
      setIsAuth(true);
      return true;
    } catch (err) {
      clearAuth();
      return false;
    }
  };

  const logout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, setIsAuth, // Добавьте это
        setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};