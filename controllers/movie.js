const { Movies } = require('../config');

class MovieController {
  static createMovie(req, res, next) {
    const { name, poster, popularity, description, tags } = req.body;

    Movies.create({ name, poster, popularity, description, tags })
      .then(movie => {
        return res.status(201).json(movie);
      })
      .catch(error => {
        next(error)
      })
  }

  static readAllMovies(req, res, next) {
    Movies.find()
      .sort('name')
      .then(movies => {
        return res.status(200).json(movies);
      })
      .catch(error => {
        next(error)
      })
  }

  static readOneMovie(req, res, next) {
    const { id } = req.params;

    Movies.findById(id)
      .then(movie => {
        return res.status(200).json(movie);
      })
      .catch(error => {
        next(error)
      })
  }

  static updateMovie(req, res, next) {
    const { id } = req.params;
    const { name, poster, popularity, description, tags } = req.body;

    Movies.findByIdAndUpdate(id, { name, poster, popularity, description, tags }, { new: true, runValidators: true })
      .then(movie => {
        return res.status(200).json(movie);
      })
      .catch(error => {
        next(error)
      })
  }

  static deleteMovie(req, res, next) {
    const { id } = req.params;

    Movies.findByIdAndDelete(id)
      .then(_ => {
        return res.status(200).json({ message: 'Success delete data' })
      })
      .catch(error => {
        return next(error);
      })
  }
}

module.exports = MovieController;