const router = require('express').Router();
const MovieController = require('../controllers/movie');
const { authentication } = require('../middlewares/auth');

router.get('/', MovieController.readAllMovies);
router.get('/detail/:id', MovieController.readOneMovie);

//Authentication
router.use(authentication);

router.post('/add', MovieController.createMovie);
router.put('/edit/:id', MovieController.updateMovie);
router.delete('/delete/:id', MovieController.deleteMovie);

module.exports = router;