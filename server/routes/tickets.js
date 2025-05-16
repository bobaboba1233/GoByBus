const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Ticket = require('../models/Ticket');
const Route = require('../models/Route');

router.post('/', auth, async (req, res) => {
  try {
    const { routeId, seatNumber, passengerName, passengerPassport } = req.body;
    const userId = req.user.id;
    console.log('Полученные данные:', req.body);
    if (!mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ error: 'Неверный ID маршрута' });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ error: 'Маршрут не найден' });
    }

    if (!route.availableSeats.includes(seatNumber)) {
      return res.status(400).json({ error: 'Место уже занято или не существует' });
    }

    const ticket = new Ticket({
      route: routeId,
      user: userId,
      seatNumber,
      passengerName,
      passengerPassport
    });
    // Явная проверка перед сохранением
    const exists = await Ticket.findOne({ 
    route: routeId, 
    seatNumber,
    status: 'booked' 
  });
  console.log("ticket: " + seatNumber);
  if (exists) {
    return res.status(400).json({ error: "Место уже занято" });
  }
    await ticket.save();

    route.availableSeats = route.availableSeats.filter(s => s !== seatNumber);
    await route.save();
      // Удаляем место из availableSeats (рабочий вариант)
    await Route.findByIdAndUpdate(
      route,
      { $pull: { availableSeats: seatNumber } },
      { new: true }
    );
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Ошибка создания билета:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Это место уже забронировано' });
    }
    res.status(500).json({ error: 'Ошибка при создании бронирования', message: error.message });
  }
});
// Получение билетов пользователя
router.get('/my', auth, async (req, res) => {
  console.log('Запрос на /api/tickets/my');
  console.log('User ID:', req.user.id); // Проверьте, что пользователь определён
  
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate('route')
      .lean();
      
    console.log('Найдены билеты:', tickets.length);
    res.json(tickets);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: error.message });
  }
});
// GET /api/tickets/:id
router.get('/id/:id', auth, async (req, res) => {
  try {
    const ticketId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ error: 'Некорректный ID билета' });
    }

    const ticket = await Ticket.findOne({
      _id: ticketId,
      user: req.user.id // Проверяем, что билет принадлежит текущему пользователю
    }).populate('route');

    if (!ticket) {
      return res.status(404).json({ 
        error: 'Билет не найден или у вас нет доступа' 
      });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Ошибка при получении билета:', error);
    res.status(500).json({ error: 'Ошибка при получении билета' });
  }
});





// PATCH /api/tickets/:id/cancel - Отмена билета
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    // 1. Проверяем существование билета
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: 'booked' // Можно отменять только активные билеты
    }).populate('route');

    if (!ticket) {
      return res.status(404).json({ 
        error: 'Билет не найден, уже использован или отменен',
        details: 'Не удалось найти активный билет для отмены'
      });
    }

    // 2. Обновляем статус билета
    ticket.status = 'cancelled';
    await ticket.save();

    // 3. Возвращаем место в доступные
    await mongoose.model("Route").findByIdAndUpdate(
      ticket.route._id,
      { $addToSet: { availableSeats: ticket.seatNumber } }
    );
    // Сортируем массив
    await mongoose.model("Route").findByIdAndUpdate(
      ticket.route._id,
      { $push: { availableSeats: { $each: [], $sort: 1 } } }
    );
    res.json({
      success: true,
      message: 'Билет успешно отменен',
      ticket: {
        _id: ticket._id,
        bookingReference: ticket.bookingReference,
        status: ticket.status,
        seatNumber: ticket.seatNumber,
        route: ticket.route._id
      }
    });
  } catch (error) {
  console.error('Full error:', error); // Логируем весь объект ошибки
  console.error('Error details:', {
    message: error.message,
    code: error.code,
    stack: error.stack,
    ticketId: req.params.id,
    userId: req.user.id
  });
    
    res.status(500).json({ 
      error: 'Ошибка при отмене билета',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Внутренняя ошибка сервера'
    });
  }
});

module.exports = router;