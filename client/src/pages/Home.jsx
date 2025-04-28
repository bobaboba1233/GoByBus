import React from 'react';
import SearchForm from '../components/SearchForm';
import '../styles/home.css';
import RouteList from '../components/RouteList';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Найдите идеальное путешествие</h1>
        <p className="subtitle">Откройте для себя лучшие направления по выгодным ценам</p>
        <SearchForm />
        <RouteList/>
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