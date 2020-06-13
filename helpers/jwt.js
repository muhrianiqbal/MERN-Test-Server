const jwt = require('jsonwebtoken');

function generateToken(data) {
  return jwt.sign(data, process.env.TOKEN);
}

function verify(token) {
  return jwt.verify(token, process.env.TOKEN);
}

module.exports = { generateToken, verify };