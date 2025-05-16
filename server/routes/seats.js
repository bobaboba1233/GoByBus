// routes/seats.js
const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat');

// Получить все места по маршруту
router.get('/routes/:routeId/seats', async (req, res) => {
  try {
    const seats = await Seat.find({ routeId: req.params.routeId });
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера при получении мест' });
  }
});

module.exports = router;
