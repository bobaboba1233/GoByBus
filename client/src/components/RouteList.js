import { useNavigate } from 'react-router-dom';
import '../styles/routeList.css';

const RouteList = ({ routes }) => {
  const navigate = useNavigate();

  if (routes.length === 0) {
    return (
      <div className="route-list-container">
        <div className="route-empty">Маршруты не найдены. Попробуйте изменить параметры поиска.</div>
      </div>
    );
  }

  const handleBookClick = (routeId) => {
    navigate(`/ticket/${routeId}`);
  };

  return (
    <div className="route-list-container">
      <h2>Найденные маршруты</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>Отправление</th>
            <th>Прибытие</th>
            <th>Время в пути</th>
            <th>Номер автобуса</th>
            <th>Цена</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {routes.map(route => (
            <tr key={route._id}>
              <td data-label="Отправление">
                <div className="time-cell">
                  <span className="time">
                    {new Date(route.date).toLocaleDateString()} {route.departureTime}
                  </span>
                  <span className="city">{route.from}</span>
                </div>
              </td>
              <td data-label="Прибытие">
                <div className="time-cell">
                  <span className="time">
                    {new Date(route.arrivalTime).toLocaleString().substring(0, 17)}
                  </span>
                  <span className="city">{route.to}</span>
                </div>
              </td>
              <td data-label="Время в пути">
                {route.duration} ч
              </td>
              <td data-label="Номер автобуса">
                <span className="transport-number">{route.busNumber}</span>
              </td>
              <td data-label="Цена">
                <span className="price">{route.price} ₽</span>
              </td>
              <td>
                <button 
                  className="book-button"
                  onClick={() => handleBookClick(route._id)}
                >
                  Выбрать
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RouteList;