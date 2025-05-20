  import { useState, useEffect } from 'react';
  import axios from 'axios';
  import SearchForm from '../components/SearchForm';
  import '../styles/home.css';
  import RouteList from '../components/RouteList';
  import { useNavigate } from 'react-router-dom';

  const Home = () => {
    const [routes, setRoutes] = useState([]);
    const [filteredRoutes, setFilteredRoutes] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
      window.onload = function() {
      const urlParams = new URLSearchParams(window.location.search);
      const emailConfirmed = urlParams.get('emailConfirmed');

      if (emailConfirmed) {
        navigate('/');
        alert('Ваш email успешно подтвержден!');
      }
      };

      axios.get('/api/routes')
        .then(response => {
          setRoutes(response.data);
          setFilteredRoutes(response.data);
        })
        .catch(error => console.error('Ошибка загрузки маршрутов:', error));
    }, []);

    const handleSearch = ({ from, to, date }) => {
      const filtered = routes.filter(route => {
        const matchesFrom = from
          ? route.from?.toLowerCase().includes(from.toLowerCase())
          : true;
        const matchesTo = to
          ? route.to?.toLowerCase().includes(to.toLowerCase())
          : true;
        const matchesDate = date
          ? new Date(route.date).toLocaleDateString() === new Date(date).toLocaleDateString()
          : true;
        return matchesFrom && matchesTo && matchesDate;
      });
      setFilteredRoutes(filtered);
    };

    return (
      <div className="home-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Найдите идеальное путешествие</h1>
            <p className="subtitle">Откройте для себя лучшие направления по выгодным ценам</p>
          </div>
        </div>

        <div className="main-layout">
          <div className="content-wrapper">
            <div className="main-content">
              <SearchForm onSearch={handleSearch} />
            </div>
            
            <aside className="sidebar">
              <div className="sidebar-card">
                <h4>Помощь в поездке</h4>
                <ul>
                  <li>📞 Горячая линия</li>
                  <li>📄 Условия возврата</li>
                  <li>📍 Пункты отправления</li>
                  <li>💳 Оплата онлайн</li>
                </ul>
              </div>
              <div className="sidebar-card">
                <h4>Советы</h4>
                <p>Выбирайте рейсы вне часа пик — дешевле и свободнее.</p>
              </div>
            </aside>
            
            <div className="routes-wrapper">
              <RouteList routes={filteredRoutes} />
            </div>
          </div>
        </div>

        <div className="features-wrapper">
          <h2 className="features-title">Почему выбирают нас</h2>
          <div className="features-grid three-columns">
            <div className="feature-item large">
              <div className="feature-icon">⚡</div>
              <div>
                <h3>Быстро и удобно</h3>
                <p>Ищите и бронируйте билеты за пару кликов. Наш сервис работает мгновенно.</p>
              </div>
            </div>
            <div className="feature-item large">
              <div className="feature-icon">🛡️</div>
              <div>
                <h3>Надёжность гарантирована</h3>
                <p>Работаем только с проверенными перевозчиками. Поддержка 24/7.</p>
              </div>
            </div>
            <div className="feature-item large">
              <div className="feature-icon">💰</div>
              <div>
                <h3>Экономьте с нами</h3>
                <p>Лучшие цены без скрытых платежей. Прозрачные условия бронирования.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Home;