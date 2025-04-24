import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';
import '../styles/header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src={logo} alt="Логотип" />
        </Link>
        <nav className="nav">
          <Link to="/">Главная</Link>
          <Link to="/tours">Выгодные путевки</Link>
          <Link to="/support">Поддержка</Link>
          <Link to="/auth" className="auth-link">Вход</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;