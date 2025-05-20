const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Проверяем заголовки в разных регистрах
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  if (!authHeader) {
    console.log('❌ Нет заголовка Authorization');
    return res.status(401).json({ message: 'Не авторизован' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer токен" → "токен"
  console.log('Токен из заголовка:', token);

  if (!token) {
    console.log('❌ Токен не извлечён');
    return res.status(401).json({ message: 'Не авторизован' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('❌ Ошибка верификации токена:', err.message);
      return res.status(403).json({ message: 'Ошибка авторизации' });
    }

    req.user = { id: decoded.userId };
    next();
  });
};

module.exports = authMiddleware;