import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';
import '../styles/header.css';
import Login from './Login';
import { AuthContext } from '../context/AuthContext';
import Register from './Register';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuth, logout } = useContext(AuthContext);
  const menuRef = useRef();

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          
          {isAuth ? (
            <div className="user-menu-container" ref={menuRef}>
              <div 
                className="user-avatar" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.email[0]}&background=random`} 
                  alt="Аватар" 
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=U&background=random`;
                  }}
                />
              </div>
              
              {isMenuOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <FaUser className="menu-icon" /> Мой профиль
                  </Link>
                  <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                    <FaCog className="menu-icon" /> Настройки
                  </Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }}>
                    <FaSignOutAlt className="menu-icon" /> Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="auth-link" 
              onClick={() => setLoginOpen(true)}
            >
              Вход
            </button>
          )}
        </nav>

        {/* Модальные окна */}
        {isLoginOpen && (
          <Login
            onClose={() => setLoginOpen(false)}
            onSwitchToRegister={() => {
              setLoginOpen(false);
              setRegisterOpen(true);
            }}
          />
        )}

        {isRegisterOpen && (
          <Register
            onClose={() => setRegisterOpen(false)}
            onSwitchToLogin={() => {
              setRegisterOpen(false);
              setLoginOpen(true);
            }}
          />
        )}
      </div>
    </header>
  );
};

export default Header;