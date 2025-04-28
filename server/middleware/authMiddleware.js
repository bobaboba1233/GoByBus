const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Нет токена, доступ запрещен' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // <-- тот же самый ключ
    req.user = { id: decoded.userId }; // <-- ВАЖНО! userId из токена кладем как id
    next();
  } catch (err) {
    res.status(401).json({ message: 'Неверный токен' });
  }
};
