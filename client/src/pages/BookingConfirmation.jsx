import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/BookingConfirmation.css';
import { FaBus, FaUser, FaTicketAlt, FaPrint, FaHome, FaCheckCircle } from 'react-icons/fa';

const BookingConfirmation = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchTicket = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      const response = await fetch(`http://localhost:5000/api/tickets/id/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Билет не найден или у вас нет доступа');
      }
      
      const data = await response.json();
      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchTicket();
}, [ticketId]);

  const handlePrint = () => {
    window.print();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Загружаем данные вашего билета...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h2>Ошибка загрузки билета</h2>
      <p>{error}</p>
      <button onClick={handleBackToHome} className="primary-btn">
        Вернуться на главную
      </button>
    </div>
  );

  if (!ticket) return (
    <div className="not-found-container">
      <h2>Билет не найден</h2>
      <p>Попробуйте оформить бронирование еще раз</p>
      <button onClick={handleBackToHome} className="primary-btn">
        Вернуться на главную
      </button>
    </div>
  );

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <FaCheckCircle className="success-icon" />
          <h1>Бронирование подтверждено!</h1>
          <p className="ticket-id">Номер билета: {ticketId}</p>
        </div>

        <div className="ticket-details">
          <div className="detail-section route-info">
            <h2><FaBus /> Информация о маршруте</h2>
            <div className="detail-row">
              <span>Направление:</span>
              <strong>{ticket.route.from} → {ticket.route.to}</strong>
            </div>
            <div className="detail-row">
              <span>Дата и время:</span>
              <strong>{new Date(ticket.route.date).toLocaleString('ru-RU')}</strong>
            </div>
            <div className="detail-row">
              <span>Цена:</span>
              <strong className="price">{ticket.route.price} ₽</strong>
            </div>
          </div>

          <div className="detail-section passenger-info">
            <h2><FaUser /> Пассажир</h2>
            <div className="detail-row">
              <span>ФИО:</span>
              <strong>{ticket.passengerName}</strong>
            </div>
            <div className="detail-row">
              <span>Паспорт:</span>
              <strong>{ticket.passengerPassport}</strong>
            </div>
          </div>

          <div className="detail-section seat-info">
            <h2><FaTicketAlt /> Место</h2>
            <div className="seat-number">{ticket.seatNumber}</div>
            <div className="bus-scheme">
              <div className="driver-place">Водитель</div>
              {Array.from({ length: 10 }).map((_, row) => (
                <div key={row} className="bus-row">
                  <div className={`seat ${ticket.seatNumber === row * 4 + 1 ? 'selected' : ''}`}>
                    {row * 4 + 1}
                  </div>
                  <div className={`seat ${ticket.seatNumber === row * 4 + 2 ? 'selected' : ''}`}>
                    {row * 4 + 2}
                  </div>
                  <div className="aisle"></div>
                  <div className={`seat ${ticket.seatNumber === row * 4 + 3 ? 'selected' : ''}`}>
                    {row * 4 + 3}
                  </div>
                  <div className={`seat ${ticket.seatNumber === row * 4 + 4 ? 'selected' : ''}`}>
                    {row * 4 + 4}
                  </div>
                </div>
              ))}
              <div className="bus-exit">Выход</div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button onClick={handlePrint} className="print-btn">
            <FaPrint /> Распечатать билет
          </button>
          <button onClick={handleBackToHome} className="home-btn">
            <FaHome /> На главную
          </button>
        </div>

        <div className="confirmation-footer">
          <p>Предъявите этот билет при посадке в автобус</p>
          <p className="booking-date">
            Бронирование оформлено: {new Date(ticket.createdAt).toLocaleString('ru-RU')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;