const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  departureCity: { type: String, required: true },
  arrivalCity: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  seatsAvailable: { type: Number, default: 40 }
});

module.exports = mongoose.model('Route', RouteSchema);