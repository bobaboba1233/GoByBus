import React, { useState } from 'react';
import '../styles/Auth.css';

const Register = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Form data:', formData);  // Логируем перед отправкой

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка регистрации');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      onClose();
      window.location.reload();  // Перезагружаем страницу, чтобы обновить состояние
    } catch (err) {
      console.error('Error response:', err.message);
      setError(err.message || 'Ошибка регистрации');
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
        
        <h2 className="auth-title">Регистрация</h2>
        
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
              placeholder="Не менее 6 символов"
              minLength="6"
            />
          </div>
          
          <div className="auth-input-group">
            <label>Подтвердите пароль</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Повторите пароль"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="auth-switch">
          Уже есть аккаунт?{' '}
          <button className="auth-switch-btn" onClick={onSwitchToLogin}>
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
