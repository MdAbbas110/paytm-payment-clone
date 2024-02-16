const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');

const authMiddleware = (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
    return res.status(403).json({
      msg: 'not a valid user',
    });
  }

  const token = authHeaders.split(' ')[1];
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    req.userId = decode.userId;
    next();
  } catch (error) {
    res.status(404).json({
      msg: 'Wrong usrId or password',
    });
  }
};

module.exports = { authMiddleware };
