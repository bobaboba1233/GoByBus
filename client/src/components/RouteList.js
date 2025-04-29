// components/RouteList.js
import React from 'react';

function RouteList({ routes }) {
  if (!routes.length) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Маршруты не найдены.</p>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto' }}>
      <h2 style={{ textAlign: 'center' }}>Доступные маршруты</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {routes.map(route => (
          <li key={route._id} style={{
            padding: '12px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{route.departureCity} → {route.arrivalCity}</span>
            <span>{route.price} ₽</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RouteList;
