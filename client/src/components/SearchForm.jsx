import React, { useState, useEffect, useCallback } from 'react';
import citiesData from '../cities.json';
import '../styles/searchForm.css';

const SearchForm = ({ onSearch, initialValues = {}, wide, isLoading }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromClicked, setFromClicked] = useState(false);
  const [toClicked, setToClicked] = useState(false);

  useEffect(() => {
    setFrom(initialValues.from || '');
    setTo(initialValues.to || '');
    setDate(initialValues.date || '');
  }, [initialValues]);

  const filterCities = useCallback((query) => {
    if (!query || query.length < 1) return [];
    return citiesData
      .filter(city => city.name.toLowerCase().startsWith(query.toLowerCase()))
      .sort((a, b) => b.population - a.population);
  }, []);

  const handleInput = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'from') {
      setFrom(value);
      setFromSuggestions(filterCities(value));
      setShowFromSuggestions(true);
    }
    if (name === 'to') {
      setTo(value);
      setToSuggestions(filterCities(value));
      setShowToSuggestions(true);
    }
    if (name === 'date') {
      setDate(value);
    }
  }, [filterCities]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const isValidCity = (val, suggestions) =>
      suggestions.some(city => city.name.toLowerCase() === val.toLowerCase());

    if (
      !isLoading &&
      from &&
      to &&
      isValidCity(from, fromSuggestions) &&
      isValidCity(to, toSuggestions)
    ) {
      onSearch({ from, to, date });
    }
  }, [from, to, date, onSearch, isLoading, fromSuggestions, toSuggestions]);

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit} className={`search-form ${wide ? 'wide' : ''}`}>
        {wide && <h2 className="form-title">Поиск билетов</h2>}

        <div className="form-grid">
          {/* FROM */}
          <div className="input-group">
            <label htmlFor="from">Откуда</label>
            <div className="input-wrapper">
              <input
                id="from"
                name="from"
                value={from}
                onChange={handleInput}
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowFromSuggestions(false);
                    const match = fromSuggestions.find(c => c.name.toLowerCase() === from.toLowerCase());
                    if (!fromClicked && !match && fromSuggestions.length > 0) {
                      setFrom(fromSuggestions[0].name);
                    }
                    setFromClicked(false);
                  }, 200);
                }}
                placeholder="Город отправления"
                autoComplete="off"
              />
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <ul className="suggestions">
                  {fromSuggestions.map(city => (
                    <li
                      key={city.name}
                      onMouseDown={() => {
                        setFrom(city.name);
                        setFromClicked(true);
                        setShowFromSuggestions(false);
                      }}
                    >
                      {city.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* TO */}
          <div className="input-group">
            <label htmlFor="to">Куда</label>
            <div className="input-wrapper">
              <input
                id="to"
                name="to"
                value={to}
                onChange={handleInput}
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowToSuggestions(false);
                    const match = toSuggestions.find(c => c.name.toLowerCase() === to.toLowerCase());
                    if (!toClicked && !match && toSuggestions.length > 0) {
                      setTo(toSuggestions[0].name);
                    }
                    setToClicked(false);
                  }, 200);
                }}
                placeholder="Город прибытия"
                autoComplete="off"
              />
              {showToSuggestions && toSuggestions.length > 0 && (
                <ul className="suggestions">
                  {toSuggestions.map(city => (
                    <li
                      key={city.name}
                      onMouseDown={() => {
                        setTo(city.name);
                        setToClicked(true);
                        setShowToSuggestions(false);
                      }}
                    >
                      {city.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* DATE */}
          <div className="input-group date-group">
            <label htmlFor="date">Дата (необязательно)</label>
            <div className="input-wrapper">
              <input
                id="date"
                name="date"
                type="date"
                value={date}
                onChange={handleInput}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        <div className="search-button-container">
          <button
            type="submit"
            className="search-button"
            disabled={!from || !to || isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Найти билеты'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
