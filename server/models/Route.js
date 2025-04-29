// models/Route.js
const mongoose = require('mongoose');

// Создание схемы маршрута
const routeSchema = new mongoose.Schema({
  from: { type: String, required: true }, // Откуда
  to: { type: String, required: true },   // Куда
  date: { type: Date, required: true },   // Дата
  price: { type: Number, required: true }, // Цена
});

// Модель маршрута
const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
