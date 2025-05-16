// SearchForm.js (без изменений в компоненте)
import { useState } from 'react';
import '../styles/searchForm.css';

const cities = [
  'Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск',
  'Екатеринбург', 'Краснодар', 'Сочи', 'Нижний Новгород', 'Стерлитамак'
];

export default function SearchForm({ onSearch }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ from, to, date });
  };

  const filterCities = (input) =>
    cities.filter(city =>
      city.toLowerCase().includes(input.toLowerCase())
    );

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit} className="search-form">
        <h2 className="form-title">Поиск билетов</h2>
        
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="from">Откуда</label>
            <div className="input-wrapper">
              <input
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                placeholder="Город отправления"
              />
              {showFromSuggestions && from && (
                <ul className="suggestions">
                  {filterCities(from).map(city => (
                    <li 
                      key={city} 
                      onClick={() => {
                        setFrom(city);
                        setShowFromSuggestions(false);
                      }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="to">Куда</label>
            <div className="input-wrapper">
              <input
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                placeholder="Город прибытия"
              />
              {showToSuggestions && to && (
                <ul className="suggestions">
                  {filterCities(to).map(city => (
                    <li 
                      key={city} 
                      onClick={() => {
                        setTo(city);
                        setShowToSuggestions(false);
                      }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="input-group date-group">
            <label htmlFor="date">Дата (необязательно)</label>
            <div className="input-wrapper">
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="search-button"
          disabled={!from || !to}
        >
          Найти билеты
        </button>
      </form>
    </div>
  );
}