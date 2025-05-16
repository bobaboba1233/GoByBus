import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Логирование для отладки
        if (token) {
          const meRes = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });

          if (meRes.ok) {
            const user = await meRes.json();
            setUser(user);
            setIsAuth(true);
          } else {
            clearAuth();
          }
        }
      } catch (err) {
        console.error('Ошибка при проверке аутентификации:', err);
        clearAuth();
      }
    };

    checkAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuth(false);
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      console.log('Received token:', data.token); // Логирование токена для отладки
      localStorage.setItem('token', data.token);

      const meRes = await fetch('http://localhost:5000/api/auth/me', {
         headers: {
        'Authorization': `Bearer ${data.token}`,
        },
      });

      if (!meRes.ok) {
        throw new Error('Failed to fetch user');
      }

      const user = await meRes.json();
      setUser(user);
      setIsAuth(true);
      return true;
    } catch (err) {
      console.error('Ошибка при логине:', err);
      clearAuth();
      return false;
    }
  };

  const logout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, setUser, login, logout, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
