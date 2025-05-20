const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Импорт роутов
const routesRoutes = require('./routes/routes');

// Настройка Express
const app = express();
app.use(express.json()); // Обработка JSON


app.use(cors({
  origin: 'http://localhost:3000', // URL вашего фронтенда
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type'], // Разрешаем Authorization
}));
app.use(bodyParser.json());
// Подключение роутов
app.use('/api', routesRoutes); // Все роуты теперь начинаются с /api
// Далее твои маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/tickets', require('./routes/tickets'));

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/gobybus', { 
})
.then(() => console.log('MongoDB подключена'))
.catch(err => console.error('Ошибка MongoDB:', err));

// Запуск сервера
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
}); 