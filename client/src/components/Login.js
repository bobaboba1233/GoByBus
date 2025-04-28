import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';

const Login = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('token', response.data.token);
      onClose();
      window.location.reload(); // Обновляем страницу после входа
    } catch (err) {
      setError(err.response?.data.message || 'Ошибка входа');
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