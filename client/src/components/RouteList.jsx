import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RouteList() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/routes')
      .then(response => setRoutes(response.data))
      .catch(error => console.error('Ошибка загрузки маршрутов:', error));
  }, []);

  return (
    <div>
      <h2>Доступные маршруты</h2>
      <ul>
        {routes.map(route => (
          <li key={route._id}>
            {route.departureCity} → {route.arrivalCity} - {route.price} руб.
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RouteList;