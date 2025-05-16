import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBus, FaCalendarAlt, FaUser, FaMoneyBillWave, FaArrowLeft, FaPrint } from 'react-icons/fa';
import '../styles/TicketDetails.css';

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
          throw new Error('Ошибка при загрузке билета');
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

  if (loading) return <p className="ticket-loading">Загрузка...</p>;
  if (error) return <p className="ticket-error">{error}</p>;
  if (!ticket) return null;

  return (
    <div className="ticket-details">
      <div className="ticket-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft /> Назад
        </button>
        <h2><FaBus /> Билет #{ticket._id.slice(-6)}</h2>
      </div>

      <div className={`ticket-card ${ticket.status}`}>
        <div className="ticket-row">
          <FaBus />
          <span>{ticket.route.from} → {ticket.route.to}</span>
        </div>

        <div className="ticket-row">
          <FaCalendarAlt />
          <span>
            {new Date(ticket.route.date).toLocaleDateString()} {ticket.route.departureTime}
          </span>
        </div>

        <div className="ticket-row">
          <FaUser />
          <span>{ticket.passengerName}</span>
        </div>

        <div className="ticket-row">
          <FaMoneyBillWave />
          <span>{ticket.route.price} ₽ • Место {ticket.seatNumber}</span>
        </div>

        <div className="ticket-row">
          <strong>Статус:</strong>
          <span className={`status ${ticket.status}`}>
            {ticket.status === 'booked' ? 'Активен' : ticket.status === 'used' ? 'Использован' : 'Отменён'}
          </span>
        </div>

        <div className="ticket-footer">
          <span>Оформлен: {new Date(ticket.createdAt).toLocaleString('ru-RU')}</span>
        </div>
      </div>

      <button onClick={handlePrint} className="print-btn">
        <FaPrint /> Распечатать
      </button>
    </div>
  );
};

export default TicketDetails;
