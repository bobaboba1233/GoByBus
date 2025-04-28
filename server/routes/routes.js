const express = require('express');
const router = express.Router();
const Route = require('../models/Route');

// Получить все маршруты
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Создать новый маршрут (для админки)
router.post('/', async (req, res) => {
  const route = new Route(req.body);
  try {
    const savedRoute = await route.save();
    res.status(201).json(savedRoute);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;