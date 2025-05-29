import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import SearchForm from '../components/SearchForm';
import RouteList from '../components/RouteList';
import { useNavigate } from 'react-router-dom';
import heroBg from '../hero-bg.jpg';
import '../styles/home.css';

const Home = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [searchParams, setSearchParams] = useState({ from: '', to: '', date: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialSearch, setIsInitialSearch] = useState(true);
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const checkEmailConfirmation = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('emailConfirmed')) {
        navigate('/', { replace: true });
        setTimeout(() => alert('✅ Ваш email успешно подтвержден!'), 300);
      }
    };

    const fetchRoutes = async () => {
      try {
        const { data } = await axios.get('/api/routes');
        setRoutes(data);
        setFilteredRoutes(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки маршрутов:', err);
        setIsLoading(false);
      }
    };

    checkEmailConfirmation();
    fetchRoutes();
  }, [navigate]);

  const handleSearch = useCallback((params) => {
    const filtered = routes.filter(route => {
      const matchFrom = params.from ? route.from?.toLowerCase().includes(params.from.toLowerCase()) : true;
      const matchTo = params.to ? route.to?.toLowerCase().includes(params.to.toLowerCase()) : true;
      const routeDate = new Date(route.date);
      const searchDate = params.date ? new Date(params.date) : null;

      return matchFrom && matchTo && (!params.date ||
        routeDate.getFullYear() === searchDate.getFullYear() &&
        routeDate.getMonth() === searchDate.getMonth() &&
        routeDate.getDate() === searchDate.getDate());
    });

    setFilteredRoutes(filtered);
    setSearchParams(params);

    if (isInitialSearch) {
      setIsInitialSearch(false);
      setTimeout(() => {
        if (resultsRef.current) {
          const offset = -160; // поднимаем прокрутку чуть выше
          const top = resultsRef.current.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }

      }, 100);
    }
  }, [routes, isInitialSearch]);

 

  return (
    <div className="home-page">
      <section
        ref={heroRef}
        className={`hero-section ${!isInitialSearch ? 'shrinked' : ''}`}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBg})`
        }}
      >
        <div className="hero-overlay"></div>
        <div className={`hero-content ${!isInitialSearch ? 'shrinked' : ''}`}>
          <h1 className={`hero-title ${!isInitialSearch ? 'shrinked' : ''}`}>Найдите идеальное путешествие</h1>
          <p className={`hero-subtitle ${!isInitialSearch ? 'shrinked' : ''}`}>Откройте для себя лучшие направления по выгодным ценам</p>

          {isInitialSearch && (
            <div className="hero-search-container">
              <SearchForm
                onSearch={handleSearch}
                initialValues={searchParams}
                wide={true}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </section>

      {/* ПЕРЕНОСИМ БЛОК С РЕЗУЛЬТАТАМИ ВЫШЕ features-wrapper */}
      <section
        className={`main-layout ${isInitialSearch ? 'invisible' : ''}`}
        ref={resultsRef}
      >
        <div className="content-wrapper">
          <main className="main-content">
            <SearchForm
              onSearch={handleSearch}
              initialValues={searchParams}
              wide={false}
              isLoading={isLoading}
            />
            <div className="routes-wrapper">
              {filteredRoutes.length > 0 ? (
                <RouteList routes={filteredRoutes} />
              ) : (
                <div className="no-routes">
                  🗺️ Маршруты не найдены. Попробуйте изменить параметры поиска
                </div>
              )}
            </div>
          </main>

          <aside className="sidebar">
            <div className="sidebar-card help-card">
              <h4>🚀 Помощь в поездке</h4>
              <ul className="help-list">
                <li className="help-item">📞 Горячая линия: 8-800-123-45-67</li>
                <li className="help-item">📄 Условия возврата билетов</li>
                <li className="help-item">📍 Карта пунктов отправления</li>
                <li className="help-item">💳 Безопасная оплата онлайн</li>
              </ul>
            </div>
            <div className="sidebar-card tip-card">
              <h4>💡 Советы путешественникам</h4>
              <p className="tip-text">
                Бронируйте билеты заранее - так вы получите лучшие цены.
                Утренние рейсы обычно менее загружены.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="features-wrapper">
        <div className="features-container">
          <h2 className="features-title">Почему выбирают нас</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-content">
                <h3>Быстро и удобно</h3>
                <p>Ищите и бронируйте билеты за пару кликов. Наш сервис работает мгновенно без задержек.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <div className="feature-content">
                <h3>Надёжность гарантирована</h3>
                <p>Работаем только с проверенными перевозчиками. Круглосуточная поддержка клиентов.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💰</div>
              <div className="feature-content">
                <h3>Экономьте с нами</h3>
                <p>Лучшие цены без скрытых платежей. Специальные предложения для постоянных клиентов.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
