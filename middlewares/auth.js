const { verify } = require('../helpers/jwt');
const { Users } = require('../config');
const { use } = require('../routes');

function authentication(req, res, next) {
  try {
    const { id } = verify(req.headers.token);

    Users.findById(id)
      .then(user => {
        return next();
      })
      .catch(error => {
        return res.status(401).json({ error: 'Unauthorized' });
      })
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = { authentication };