const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Получение профиля пользователя
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при загрузке профиля' });
  }
});



// Обновление профиля пользователя
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    // Проверка email на уникальность (если email изменен)
    const existingUser = email ? await User.findOne({ email }) : null;
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(400).json({ message: 'Email уже используется' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, phone },
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Ошибка валидации', errors: err.errors });
    }
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


module.exports = router;