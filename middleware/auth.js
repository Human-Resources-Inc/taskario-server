const jwt = require("jsonwebtoken");

/**
 * Проверяет токен авторизации пользователя
 * @param {object} req - Запрос
 * @param {object} res - Ответ сервера
 * @param {Function} next - Callback-функция для обработки ответа
 * @returns {json} - Ответ сервера в формате JSON
 */
module.exports = function(req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};