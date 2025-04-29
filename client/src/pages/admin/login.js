// src/components/admin/AdminLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Заданные логин и пароль
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    if (email === adminEmail && password === adminPassword) {
      // Если email и пароль верны, создаем JWT
      const token = 'admin-token';  // Пример токена (это можно сгенерировать)
      localStorage.setItem('token', token); // Сохраняем токен в localStorage
      navigate('/admin'); // Перенаправляем в админ-панель
    } else {
      alert('Неверные данные');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1>Вход в админку</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}
