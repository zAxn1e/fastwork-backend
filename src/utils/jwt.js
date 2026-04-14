const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("@/config/env");

function signAuthToken(userId) {
  return jwt.sign({ sub: userId }, jwtSecret, { expiresIn: jwtExpiresIn });
}

function verifyAuthToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = {
  signAuthToken,
  verifyAuthToken,
};
