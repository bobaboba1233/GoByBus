import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {FaArrowLeft } from 'react-icons/fa';
import '../styles/ticket.css';

const Ticket = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengerInfo, setPassengerInfo] = useState({ 
    name: '', 
    passport: '' 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busLayout, setBusLayout] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);

  // Генерация схемы автобуса
  useEffect(() => {
    const generateBusLayout = () => {
      const layout = [];
      for (let row = 0; row < 12; row++) {
        const rowSeats = [
          row * 4 + 1,
          row * 4 + 2,
          null, // проход
          row * 4 + 3,
          row * 4 + 4
        ];
        layout.push(rowSeats);
      }
      setBusLayout(layout);
    };

    generateBusLayout();
  }, []);

   useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Не авторизован. Пожалуйста, войдите в аккаунт.');
        }

        const response = await fetch(`http://localhost:5000/api/routes/${routeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Маршрут не найден');
        }

        const data = await response.json();
        setRoute(data);
        setAvailableSeats(data.availableSeats || []);
      } catch (err) {
        console.error('Ошибка при получении маршрута:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteDetails();
  }, [routeId]);


  const handleSeatClick = (seatNumber) => {
    if (availableSeats.includes(seatNumber)) {
      setSelectedSeat(seatNumber);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassengerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedSeat) {
    setError('Пожалуйста, выберите место');
    return;
  }

  if (!passengerInfo.name || !passengerInfo.passport) {
    setError('Заполните все поля');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    setError('Вы не авторизованы. Пожалуйста, войдите в аккаунт.');
    return;
  }

  try {
    console.log(routeId, selectedSeat); 
    const response = await fetch('http://localhost:5000/api/tickets', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },  
      body: JSON.stringify({
        routeId,
        seatNumber: selectedSeat,
        passengerName: passengerInfo.name,
        passengerPassport: passengerInfo.passport
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка бронирования');
    }

    navigate(`/booking-confirmation/${data._id}`);

  } catch (err) {
    console.error('Ошибка бронирования:', err);
    setError(err.message || 'Произошла ошибка при бронировании');
  }
};


  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Загрузка данных маршрута...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h2>Ошибка</h2>
      <p>{error}</p>
      <button onClick={() => navigate(-1)} className="back-btn">
        <FaArrowLeft /> Вернуться назад
      </button>
    </div>
  );

  if (!route) return (
    <div className="error-container">
      <h2>Маршрут не найден</h2>
      <button onClick={() => navigate('/routes')} className="back-btn">
        Посмотреть другие маршруты
      </button>
    </div>
  );

   return (
    <div className="ticket-booking">
      <header className="booking-header">
        <h1>Оформление билета</h1>
        <div className="route-badge">№ {routeId}</div>
      </header>

      <section className="route-details">
        <div className="route-info">
          <div className="info-block">
            <span className="info-label">Направление</span>
            <h2>{route.from} → {route.to}</h2>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Дата отправления</span>
              <p>{new Date(route.date).toLocaleDateString()}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Время</span>
              <p>{route.departureTime}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Цена</span>
              <p className="price">{route.price} ₽</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-section">
            <h3>Данные пассажира</h3>
            
            <div className="form-group">
              <label htmlFor="name">ФИО</label>
              <input
                id="name"
                type="text"
                name="name"
                value={passengerInfo.name}
                onChange={handleInputChange}
                required
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div className="form-group">
              <label htmlFor="passport">Паспортные данные</label>
              <input
                id="passport"
                type="text"
                name="passport"
                value={passengerInfo.passport}
                onChange={handleInputChange}
                required
                placeholder="1234 567890"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Выбор места</h3>
            
            <div className="seat-selection">
              <div className="selected-seat-info">
                {selectedSeat ? (
                  <span>Выбрано место: <strong>{selectedSeat}</strong></span>
                ) : (
                  <span className="hint">Выберите место на схеме</span>
                )}
              </div>
              
              <div className="bus-layout">
                <div className="bus-driver">Водитель</div>
                <div className="bus-door">Дверь</div>
                
                {busLayout.map((row, rowIndex) => (
                  <div key={rowIndex} className="bus-row">
                    {row.map((seat, seatIndex) => (
                      seat === null ? (
                        <div key={`${rowIndex}-${seatIndex}`} className="aisle"></div>
                      ) : (
                        <button
                        key={seat}
                        type="button"
                        className={`seat
                          ${selectedSeat === seat ? 'selected' : ''}
                          ${!availableSeats.includes(seat) ? 'booked' : ''}`
                        }
                        onClick={() => handleSeatClick(seat)}
                        disabled={!availableSeats.includes(seat)} // сделай забронированные места недоступными
                      >
                        {seat}
                      </button>

                      )
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={!selectedSeat}>
            Подтвердить бронирование
          </button>
        </form>
      </section>
    </div>
  );
};

export default Ticket;