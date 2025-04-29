const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Импорт роутов
const routesRoutes = require('./routes/routes');

// Настройка Express
const app = express();
app.use(express.json()); // Обработка JSON


app.use(cors({
  origin: 'http://localhost:3000', // URL вашего фронтенда
  credentials: true
}));
app.use(bodyParser.json());
// Подключение роутов
app.use('/api/routes', routesRoutes);
// Далее твои маршруты
app.use('/api/auth', require('./routes/auth'));


// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/gobybus', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB подключена'))
.catch(err => console.error('Ошибка MongoDB:', err));

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});