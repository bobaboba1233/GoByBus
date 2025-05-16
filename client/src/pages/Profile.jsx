import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Загружаем информацию о пользователе при монтировании компонента
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
        setFormData(response.data);  // Заполняем форму данными пользователя
      } catch (err) {
        setError('Ошибка при загрузке профиля');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUser(response.data);
      setIsEditing(false);  // Завершаем режим редактирования
    } catch (err) {
      setError('Ошибка при сохранении данных');
      console.error(err);
    }
  };

  if (isLoading) return <div>Загрузка...</div>; // Пока идет загрузка данных, отображаем сообщение

  return (
    <div className="profile-container">
      <h1>Профиль пользователя</h1>
      {error && <div className="error-message">{error}</div>} {/* Показываем ошибку, если она есть */}

      {user ? (
        <div className="profile-details">
          <div className="profile-info">
            <div>
              <strong>Имя:</strong> {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{user.username}</span>
              )}
            </div>
            <div>
              <strong>Электронная почта:</strong> 
                <span> {user.email}</span>
            </div>
            <div>
              <strong>Телефон:</strong> {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{user.phone}</span>
              )}
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <button onClick={handleSave}>Сохранить</button>
            ) : (
              <button onClick={() => setIsEditing(true)}>Редактировать</button>
            )}
          </div>
        </div>
      ) : (
        <p>Данные профиля не найдены</p>
      )}
    </div>
  );
};

export default Profile;
