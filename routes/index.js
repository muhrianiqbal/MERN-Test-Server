const router = require('express').Router();
const movie = require('./movie');
const UserController = require('../controllers/user');

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.use('/', movie);

module.exports = router;