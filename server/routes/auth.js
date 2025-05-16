const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const auth = require('../middleware/authMiddleware'); // Middleware для проверки авторизации

// Создание транспортера для отправки email
const transporter = nodemailer.createTransport({
  service: 'mail.ru', // Используем сервис Gmail
  auth: {
    user: 'bogdan.shustrov@mail.ru',  // Замени на свой email
    pass: 'tBBWFj22uFbA5dvsjFK2',   // Замени на свой пароль
  },
   tls: {
    rejectUnauthorized: false // Некоторые серверы требуют это, чтобы избежать ошибок с безопасностью
  }
});

const sendConfirmationEmail = (email, token) => {
  const confirmationLink = `http://localhost:5000/api/auth/confirm-email?token=${token}`;

  const mailOptions = {
    from: 'bogdan.shustrov@mail.ru',  // Замени на свой email
    to: email,
    subject: 'Подтверждение email',
    html: `
      <p>Пожалуйста, подтвердите свой email, перейдя по следующей ссылке:</p>
      <a href="${confirmationLink}" style="color: #0066cc; text-decoration: none;">Подтвердить email</a>
    `,  // Используем HTML для кликабельной ссылки
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};


router.post('/register', async (req, res) => {
  try {
    const {email, password } = req.body;
    
    console.log('Регистрация: Получены данные', { email, password }); // Логирование данных, полученных от клиента

    // Проверка существования пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Ошибка: Пользователь уже существует');
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }
    console.log(password);
    // Хеширование пароля
    console.log('password до хеша:', password);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });

    // Генерация токена для подтверждения
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    user.confirmationToken = confirmationToken;
    console.log(user.password);
    await user.save();
    console.log('Пользователь сохранен успешно:', user);

    // Отправка email с ссылкой для подтверждения
    sendConfirmationEmail(email, confirmationToken);
    console.log(confirmationToken);
    res.status(201).json({ message: 'Письмо для подтверждения отправлено на ваш email.' });
  } catch (err) {
    console.error('Ошибка при регистрации:', err); // Логирование ошибки
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});



// Подтверждение email
router.get('/confirm-email', async (req, res) => {
  const { token } = req.query;
  console.log('✅ Получен токен:', token);

  try {
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      console.log('⛔ Пользователь не найден по токену');
      return res.status(400).json({ message: 'Неверный или истекший токен' });
    }

    console.log('🎉 Пользователь найден:', user.email);

    user.isConfirmed = true;
    user.confirmationToken = null;

    await user.save();

    // Перенаправление на главную страницу с параметром для отображения уведомления
    return res.redirect('http://localhost:3000/?emailConfirmed=true');
  } catch (err) {
    console.error('Ошибка при подтверждении:', err);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});



// Вход
router.post('/login',  async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Введите email и пароль' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }
    console.log(await bcrypt.compare('bog2004', user.password));
    if (!user.isConfirmed) {
      return res.status(400).json({ message: 'Пожалуйста, подтвердите ваш email' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }
    const token = jwt.sign(
      { userId: user.id },
      'bogdan', // ⚠️ проверь что одинаков везде
      { expiresIn: '1d' }
    );

    res.json({ token, userId: user.id });
  } catch (err) {
    console.error('Ошибка при логине:', err.message); // ⚠️ добавили лог
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});



// Проверка текущего пользователя
router.get('/me', auth, async (req, res) => {
    console.log('📨 [ME] Запрос получен. Headers:', req.headers);
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
