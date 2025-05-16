const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  route: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Route',
    required: true 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seatNumber: { 
    type: Number, 
    required: true,
    min: 1,
    max: 48
  },
  passengerName: {
    type: String,
    required: true,
    trim: true
  },
  passengerPassport: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'used'],
    default: 'booked'
  },
  bookingReference: {
    type: String,
    unique: true
  }
  
}, { timestamps: true });

// В модели Ticket (models/Ticket.js)
ticketSchema.index(
  { route: 1, seatNumber: 1 }, 
  { 
    unique: true,
    partialFilterExpression: { status: 'booked' } 
  }
);
// Генерация номера брони перед сохранением
ticketSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingReference = `BUS-${this.seatNumber}-${randomPart}`;
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);