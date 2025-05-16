import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBus, FaCalendarAlt, FaUser, FaMoneyBillWave, FaArrowLeft, FaPrint, FaTimes } from 'react-icons/fa';
import '../styles/TicketDetails.css';

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:5000/api/tickets/id/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Билет не найден' : 'Ошибка при загрузке билета');
        }

        const data = await res.json();
        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleCancelTicket = async () => {
    if (!window.confirm('Вы уверены, что хотите отменить этот билет?')) {
      return;
    }

    setIsCancelling(true);
    const token = localStorage.getItem('token');
    
    try {
      // 1. Отправляем запрос на отмену
      const cancelRes = await fetch(`http://localhost:5000/api/tickets/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!cancelRes.ok) throw new Error('Ошибка при отмене билета');

      // 2. Перезагружаем данные после успешной отмены
      const refreshRes = await fetch(`http://localhost:5000/api/tickets/id/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!refreshRes.ok) throw new Error('Ошибка обновления данных');
      
      const refreshedData = await refreshRes.json();
      setTicket(refreshedData);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsCancelling(false);
    }
  };
  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Загрузка билета...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h2>Ошибка</h2>
      <p>{error}</p>
      <button className="primary-btn" onClick={() => navigate(-1)}>
        Вернуться назад
      </button>
    </div>
  );

  if (!ticket) return null;

  return (
    <div className="ticket-details">
      <div className="ticket-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft /> Назад
        </button>
        <h2><FaBus /> Билет #{ticket._id?.slice(-6).toUpperCase()}</h2>
      </div>

      <div className={`ticket-card ${ticket.status}`}>
        <div className="ticket-row">
          <FaBus />
          <span>{ticket.route?.from} → {ticket.route?.to}</span>
        </div>

        <div className="ticket-row">
          <FaCalendarAlt />
          <span>
            {new Date(ticket.route?.date).toLocaleDateString('ru-RU')} в {ticket.route?.departureTime}
          </span>
        </div>

        <div className="ticket-row">
          <FaUser />
          <span>{ticket.passengerName} (Паспорт: {ticket.passengerPassport})</span>
        </div>

        <div className="ticket-row">
          <FaMoneyBillWave />
          <span>{ticket.route?.price} ₽ • Место {ticket.seatNumber}</span>
        </div>

        <div className="ticket-row">
          <strong>Статус:</strong>
          <span className={`status ${ticket.status}`}>
            {ticket.status === 'booked' ? 'Активен' : 
             ticket.status === 'used' ? 'Использован' : 'Отменён'}
          </span>
        </div>

        <div className="ticket-footer">
          <span>Оформлен: {new Date(ticket.createdAt).toLocaleString('ru-RU')}</span>
        </div>
      </div>

      <div className="ticket-actions">
        <button onClick={handlePrint} className="print-btn">
          <FaPrint /> Распечатать
        </button>
        
        {ticket.status === 'booked' && (
          <button 
            onClick={handleCancelTicket} 
            className="cancel-btn"
            disabled={isCancelling}
          >
            <FaTimes /> {isCancelling ? 'Отмена...' : 'Отменить билет'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;