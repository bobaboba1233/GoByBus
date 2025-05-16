// models/Seat.js
const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Seat', seatSchema);
