const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Получаем токен из заголовка

  if (!token) {
    return res.status(401).json({ message: 'Нет авторизации' });
  }

  try {
    // Проверяем токен с секретным ключом
    const decoded = jwt.verify(token, 'bogdan'); // 'bogdan' - секретный ключ
    req.userId = decoded.userId;  // Передаем userId в запрос
    next();  // Продолжаем выполнение
  } catch (err) {
    res.status(401).json({ message: 'Нет авторизации' });
  }
};
