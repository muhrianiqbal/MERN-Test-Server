const { Users } = require('../config');
const { decrypt, encrypt } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');

class UserController {
  static login(req, res) {
    const { email, password } = req.body;

    Users.findOne({ email })
      .then(user => {
        if (decrypt(password, user.password)) {
          return res.status(200).json({ token: generateToken({ id: user._id })});
        } else {
          return res.status(400).json({ error: 'Invalid email/password' });
        }
      })
      .catch(_ => {
        return res.status(400).json({ error: 'Invalid email/password' });
      })
  }

  static register(req, res, next) {
    const { email, password } = req.body;

    Users.create({ email, password: encrypt(password) })
      .then(_ => {
        return res.status(201).json({ message: 'Successfully created a user' });
      })
      .catch(error => {
        return next(error);
      })
  }
}

module.exports = UserController;