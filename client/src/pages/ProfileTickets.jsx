import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaBus, FaCalendarAlt, FaUser, FaMoneyBillWave, FaSearch } from 'react-icons/fa';
import '../styles/ProfileTickets.css';

const ProfileTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem('token');
      console.log('Токен из localStorage:', token); // Проверьте, что токен есть
  
      if (!token) {
        setError('Требуется авторизация');
        setLoading(false);
        return;
      }
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tickets/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка загрузки билетов');
        }

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    if (filter !== 'all' && ticket.status !== filter) {
      return false;
    }

    const routeSearch = `${ticket.route.from} ${ticket.route.to}`.toLowerCase();
    return routeSearch.includes(searchTerm.toLowerCase());
  });

  const handleTicketClick = (ticketId) => {
    navigate(`/ticketDetails/${ticketId}`);
  };

  if (loading) return (
    <div className="pt-loading">
      <div className="pt-spinner"></div>
      <p>Загрузка ваших билетов...</p>
    </div>
  );

  if (error) return (
    <div className="pt-error">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="pt-retry-btn">
        Попробовать снова
      </button>
    </div>
  );

  if (tickets.length === 0) return (
    <div className="pt-empty">
      <FaTicketAlt className="pt-empty-icon" />
      <h3>У вас пока нет билетов</h3>
      <p>Купите свой первый билет в разделе маршрутов</p>
      <button onClick={() => navigate('/')} className="pt-buy-btn">
        Посмотреть маршруты
      </button>
    </div>
  );

  return (
    <div className="profile-tickets">
      <div className="pt-header">
        <h2><FaTicketAlt /> Мои билеты</h2>

        <div className="pt-controls">
          <div className="pt-search">
            <FaSearch className="pt-search-icon" />
            <input
              type="text"
              placeholder="Поиск по маршруту..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="pt-filter">
            <option value="all">Все билеты</option>
            <option value="booked">Активные</option>
            <option value="used">Использованные</option>
            <option value="cancelled">Отменённые</option>
          </select>
        </div>
      </div>

      <div className="pt-tickets-grid">
        {filteredTickets.length === 0 ? (
          <div className="pt-no-results">
            <p>Билеты не найдены</p>
            <button onClick={() => {
              setSearchTerm('');
              setFilter('all');
            }} className="pt-clear-btn">
              Сбросить фильтры
            </button>
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <div key={ticket._id} className={`pt-ticket-card ${ticket.status}`} onClick={() => handleTicketClick(ticket._id)}>
              <div className="pt-ticket-header">
                <h3><FaBus /> {ticket.route.from} → {ticket.route.to}</h3>
                <span className={`pt-status ${ticket.status}`}>
                  {ticket.status === 'booked' ? 'Активен' : 
                   ticket.status === 'used' ? 'Использован' : 'Отменён'}
                </span>
              </div>

              <div className="pt-ticket-body">
                <div className="pt-ticket-row">
                  <FaCalendarAlt />
                  <span>
                    {new Date(ticket.route.date).toLocaleDateString()} {ticket.route.departureTime}
                  </span>
                </div>

                <div className="pt-ticket-row">
                  <FaUser />
                  <span>{ticket.passengerName}</span>
                </div>

                <div className="pt-ticket-row">
                  <FaMoneyBillWave />
                  <span>{ticket.route.price} ₽ • Место {ticket.seatNumber}</span>
                </div>
              </div>

              <div className="pt-ticket-footer">
                <span className="pt-booking-date">
                  Оформлен: {new Date(ticket.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileTickets;
