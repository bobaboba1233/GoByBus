// components/SearchForm.js
import { useState } from 'react';
import '../styles/searchForm.css'; // Подключаем наш файл стилей
import RouteList from "./RouteList"
export default function SearchForm({ onSearch }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ from, to, date });
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Откуда" required />
      <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Куда" required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <button type="submit">Найти</button>
    </form>
  );
}
