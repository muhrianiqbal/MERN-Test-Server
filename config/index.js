const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/movie-database', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  name: {
    type: String,
    required: [true, 'must be a string and is required']
  },
  poster: {
    type: String,
    required: [true, 'must be a string and is required']
  },
  popularity: {
    type: mongoose.Types.Decimal128,
    required: [true, 'must be a decimal and is required']
  },
  description: {
    type: String,
    required: [true, 'must be a string and is required']
  },
  tags: {
    type: Array,
    required: [true, 'must be a array and is required'],
  }
})

const Movies = mongoose.model('Movies', movieSchema);

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'must be a string and is required'],
    unique: true,
    validate: {
      validator: function(email) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'must be a string and is required']
  }
})

const Users = mongoose.model('users', userSchema);

module.exports = { Movies, Users };