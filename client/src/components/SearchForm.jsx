import React from 'react';
import '../styles/searchForm.css';

const SearchForm = () => {
  return (
    <div className="search-form">
      <form>
        <div className="form-group">
          <label htmlFor="from">Откуда</label>
          <input type="text" id="from" placeholder="Город вылета" />
        </div>
        <div className="form-group">
          <label htmlFor="to">Куда</label>
          <input type="text" id="to" placeholder="Город назначения" />
        </div>
        <div className="form-group">
          <label htmlFor="date">Дата</label>
          <input type="date" id="date" />
        </div>
        <button type="submit" className="search-button">Найти</button>
      </form>
    </div>
  );
};

export default SearchForm;