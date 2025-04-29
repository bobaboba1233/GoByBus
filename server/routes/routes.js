// routes/routes.js
const express = require('express');
const router = express.Router();
const Route = require('../models/Route');  // Модель маршрута
const auth = require('../middleware/authMiddleware'); // Добавьте middleware


// Получение всех маршрутов (только для админа)
router.get('/routes', async (req, res) => {
  try {
    const routes = await Route.find(); // Получаем все маршруты из базы данных
    res.json(routes);  // Отправляем список маршрутов
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
// Добавление нового маршрута (только для админа)
router.post('/routes', async (req, res) => {
  const { from, to, date, price } = req.body;

  // Проверка на обязательность данных
  if (!from || !to || !date || !price) {
    return res.status(400).json({ message: 'Все поля обязательны!' });
  }

  // Проверка на корректность формата даты
  const routeDate = new Date(date);
  if (isNaN(routeDate.getTime())) {
    return res.status(400).json({ message: 'Неверный формат даты' });
  }

  try {
    // Создание нового маршрута
    const newRoute = new Route({ from, to, date: routeDate, price });
    
    // Сохранение нового маршрута в базе данных
    await newRoute.save();

    // Отправка созданного маршрута в ответ
    res.status(201).json(newRoute);
  } catch (err) {
    console.error('Ошибка при добавлении маршрута:', err);
    res.status(500).json({ message: 'Ошибка при добавлении маршрута' });
  }
});

// Удаление маршрута (по id)
router.delete('/routes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Поиск маршрута по id и удаление его
    const deletedRoute = await Route.findByIdAndDelete(id);
    
    if (!deletedRoute) {
      return res.status(404).json({ message: 'Маршрут не найден' });
    }

    // Возвращаем сообщение об удалении
    res.json({ message: 'Маршрут удалён' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении маршрута' });
  }
});

module.exports = router;
