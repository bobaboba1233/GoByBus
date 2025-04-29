import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchForm from '../components/SearchForm';
import '../styles/home.css';
import RouteList from '../components/RouteList';

const Home = () => {
  const [routes, setRoutes] = useState([]);          // Все маршруты с сервера
  const [filteredRoutes, setFilteredRoutes] = useState([]); // Фильтрованные маршруты после поиска

  useEffect(() => {
    // Загружаем маршруты один раз при загрузке страницы
    axios.get('http://localhost:5000/api/routes')
      .then(response => {
        setRoutes(response.data);
        setFilteredRoutes(response.data);  // Изначально показываем все маршруты
      })
      .catch(error => console.error('Ошибка загрузки маршрутов:', error));
  }, []);

  // 👉 Вот она — твоя функция handleSearch
  const handleSearch = (searchParams) => {
    const { from, to, date } = searchParams;

    const filtered = routes.filter(route => {
      const matchesFrom = route.departureCity.toLowerCase().includes(from.toLowerCase());
      const matchesTo = route.arrivalCity.toLowerCase().includes(to.toLowerCase());
      return matchesFrom && matchesTo;
    });

    setFilteredRoutes(filtered);
  };
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Найдите идеальное путешествие</h1>
        <p className="subtitle">Откройте для себя лучшие направления по выгодным ценам</p>
        
        <SearchForm onSearch={handleSearch} />
      <RouteList routes={filteredRoutes} />
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">✈️</div>
          <h3>Быстро</h3>
          <p>Мгновенное бронирование</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💎</div>
          <h3>Надёжно</h3>
          <p>Проверенные туроператоры</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Выгодно</h3>
          <p>Лучшие цены на рынке</p>
        </div>
      </div>
    </div>
  );
};

export default Home;