import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';
import axios from 'axios';
export default function Index() {
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState('');
  const [newRoute, setNewRoute] = useState({
    from: '',
    to: '',
    date: '',
    price: '',
    busNumber: '',
    duration: '',
    departureTime: '',
    arrivalTime: '' // Новое поле для времени прибытия
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    } else {
      setLoading(false);
      fetchRoutes(token);
    }
  }, [navigate]);

  const fetchRoutes = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/routes', {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/routes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRoutes(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при удалении');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRoute({ ...newRoute, [name]: value });
  };

const calculateArrivalTime = (departureTime, duration) => {
  const [hours, minutes] = departureTime.split(':').map(Number);
  const departureDate = new Date(newRoute.date); // Создаем дату отправления
  departureDate.setHours(hours, minutes, 0, 0); // Устанавливаем время отправления

  // Разбиваем продолжительность на часы и минуты
  const durationHours = Math.floor(duration);
  const durationMinutes = Math.round((duration - durationHours) * 60);

  // Прибавляем продолжительность
  departureDate.setHours(departureDate.getHours() + durationHours);
  departureDate.setMinutes(departureDate.getMinutes() + durationMinutes);

  return departureDate; // Возвращаем объект Date
};



 const handleAddRoute = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  // Вычисляем время прибытия как объект Date
  const arrivalTime = calculateArrivalTime(newRoute.departureTime, newRoute.duration);

  // Преобразуем время прибытия в строку (если нужно для API)
  const arrivalTimeStr = arrivalTime.toISOString(); // Преобразует в строку ISO 8601, например: "2025-05-13T16:30:00.000Z"
  console.log(arrivalTime);
  try {
    await axios.post(
      'http://localhost:5000/api/routes',
      { ...newRoute, arrivalTime: arrivalTimeStr }, // Отправляем время прибытия как строку ISO
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchRoutes(token);
    setNewRoute({
      from: '',
      to: '',
      date: '',
      price: '',
      busNumber: '',
      duration: '',
      departureTime: '',
      arrivalTime: ''
    });
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
      <div className="add-route">
        <h2>Добавить новый маршрут</h2>
        <form onSubmit={handleAddRoute} className="add-route-form">
          <input type="text" name="from" value={newRoute.from} onChange={handleChange} placeholder="Откуда" required />
          <input type="text" name="to" value={newRoute.to} onChange={handleChange} placeholder="Куда" required />
          <input type="date" name="date" value={newRoute.date} onChange={handleChange} required />
          <input type="time" name="departureTime" value={newRoute.departureTime} onChange={handleChange} required placeholder="Отправка" />
          <input type="number" name="price" value={newRoute.price} onChange={handleChange} placeholder="Цена" required />
          <input type="text" name="busNumber" value={newRoute.busNumber} onChange={handleChange} placeholder="Номер автобуса" required />
          <input type="number" name="duration" value={newRoute.duration} onChange={handleChange} placeholder="Длительность (напр. 4.5ч)" required />
          <button type="submit" className="add-btn">Добавить маршрут</button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
      <div className="routes-list">
        <h2>Список маршрутов</h2>
        {routes.length > 0 ? (                
          <table className="routes-table">
            <thead>
              <tr>
                <th>Откуда</th>
                <th>Куда</th>
                <th>Дата</th>
                <th>Отправка</th>
                <th>Прибытие</th> {/* Добавляем столбец для времени прибытия */}
                <th>Цена</th>
                <th>Автобус</th>
                <th>Длительность</th>
                <th>Действия</th>
                </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route._id}>
                  <td>{route.from}</td>
                  <td>{route.to}</td>
                  <td>{new Date(route.date).toLocaleDateString()}</td>
                  <td>{route.departureTime}</td>
                  <td>{new Date(route.arrivalTime).toLocaleTimeString().substring(0, 5)}</td>  {/* Отображаем только время */}
                  <td>{route.price} ₽</td>
                  <td>{route.busNumber}</td>
                  <td>{route.duration} ч</td>
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
