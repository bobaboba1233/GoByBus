const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); // проверка токена

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Проверка существования пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }
    
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    
    await user.save();
    
    // Генерация токена
    const token = jwt.sign(
      { userId: user.id },
      'your-secret-key',
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ token, userId: user.id });
    
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }
    
    const token = jwt.sign(
      { userId: user.id },
      'your-secret-key',
      { expiresIn: '1h' }
    );
    
    res.json({ token, userId: user.id });
    
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
// Текущий пользователь
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;