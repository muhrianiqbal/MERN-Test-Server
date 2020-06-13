const bcrypt = require('bcrypt');
const saltRounds = 8;

function encrypt(data) {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(data, salt);
}

function decrypt(data, hash) {
  return bcrypt.compareSync(data, hash);
}

module.exports = { encrypt, decrypt };