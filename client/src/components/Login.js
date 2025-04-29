import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Импортируем AuthContext
import '../styles/Auth.css';

const Login = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setIsAuth } = useContext(AuthContext); // Используем контекст для доступа к setUser и setIsAuth

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Form data:', formData);  // Логируем перед отправкой

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка входа');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      
      // Обновляем состояние аутентификации
      setUser({ email: formData.email });
      setIsAuth(true);

      onClose();
    } catch (err) {
      console.error('Error response:', err.message);
      setError(err.message || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="auth-close-btn" onClick={onClose}>
          &times;
        </button>
        
        <h2 className="auth-title">Вход в аккаунт</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Ваш email"
            />
          </div>
          
          <div className="auth-input-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Ваш пароль"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="auth-switch">
          Нет аккаунта?{' '}
          <button className="auth-switch-btn" onClick={onSwitchToRegister}>
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
