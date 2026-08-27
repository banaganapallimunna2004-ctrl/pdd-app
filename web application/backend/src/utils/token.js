const jwt = require('jsonwebtoken');

const createToken = (payload, expiresIn, secret) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const createAccessToken = (user) => {
  return createToken({ id: user._id, role: user.role }, '15m', process.env.JWT_SECRET);
};

const createRefreshToken = (user) => {
  return createToken({ id: user._id, role: user.role }, '7d', process.env.JWT_REFRESH_SECRET);
};

module.exports = { createAccessToken, createRefreshToken };
