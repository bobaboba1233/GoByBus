const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  from: { 
    type: String, 
    required: true,
    trim: true
  },
  to: { 
    type: String, 
    required: true,
    trim: true
  },
  date: { 
    type: Date, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  availableSeats: {
    type: [Number],
    default: Array.from({length: 48}, (_, i) => i + 1)
  },
  busNumber: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // в часах
    required: true
  },
  departureTime: {
    type: String, // Изменили тип на строку для времени в формате HH:mm
    required: true
  },
  arrivalTime: {
    type: String, // Время прибытия также в формате HH:mm
    required: true
  }
}, { timestamps: true });

// Индекс для поиска маршрутов
routeSchema.index({ from: 1, to: 1, date: 1 });

module.exports = mongoose.model('Route', routeSchema);
