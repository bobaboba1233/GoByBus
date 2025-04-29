// src/components/admin/AdminPanel.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css'; // Подключаем стили
import axios from 'axios';

export default function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [newRoute, setNewRoute] = useState({
    from: '',
    to: '',
    date: '',
    price: '',
  });
  
  useEffect(() => {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login'); // Перенаправляем на страницу логина, если токена нет
    } else {
      setLoading(false); // Если токен есть, продолжаем загрузку страницы
    }
  }, [navigate]);

  const fetchRoutes = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/routes/routes', {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ вот здесь вставляется заголовок
        },
      });
      setRoutes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки маршрутов');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };
    // Вызываем fetchRoutes при загрузке компонента
    useEffect(() => {
      fetchRoutes();
    }, []);
  
  
  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен
    navigate('/admin/login'); // Перенаправляем обратно на страницу логина
  };
   // Обработчик удаления маршрута
   const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/routes/routes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRoutes(token); // Обновляем список маршрутов после удаления
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при удалении');
    }
  };

  // Обработчик изменения полей для нового маршрута
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRoute({ ...newRoute, [name]: value });
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    try {
      if (!token) {
        setError('Токен не найден!');
        return;
      }
  
      // Отправляем запрос на добавление маршрута
      await axios.post(
        'http://localhost:5000/api/routes/routes', // Обрати внимание, что это адрес для добавления маршрута
        newRoute,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Заголовок с токеном
          },
        }
      );
      fetchRoutes(token); // Обновляем список маршрутов после добавления
      setNewRoute({ from: '', to: '', date: '', price: '' }); // Очищаем форму
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при добавлении маршрута');
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Панель администратора</h1>
        <button onClick={handleLogout} className="logout-btn">Выйти</button>
      </header>

      {/* Форма для добавления нового маршрута */}
      <div className="add-route">
        <h2>Добавить новый маршрут</h2>
        <form onSubmit={handleAddRoute}>
          <input
            type="text"
            name="from"
            value={newRoute.from}
            onChange={handleChange}
            placeholder="Откуда"
            required
          />
          <input
            type="text"
            name="to"
            value={newRoute.to}
            onChange={handleChange}
            placeholder="Куда"
            required
          />
          <input
            type="date"
            name="date"
            value={newRoute.date}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            value={newRoute.price}
            onChange={handleChange}
            placeholder="Цена"
            required
          />
          <button type="submit">Добавить маршрут</button>
        </form>
      </div>

      {/* Список маршрутов */}
      <div className="routes-list">
        <h2>Список маршрутов</h2>
        {routes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Откуда</th>
                <th>Куда</th>
                <th>Дата</th>
                <th>Цена</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route._id}>
                  <td>{route.from}</td>
                  <td>{route.to}</td>
                  <td>{new Date(route.date).toLocaleDateString()}</td>
                  <td>{route.price} ₽</td>
                  <td>
                    <button onClick={() => handleDelete(route._id)} className="delete-btn">
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Нет доступных маршрутов</p>
        )}
      </div>
    </div>
  );
}
