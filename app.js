require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const router = require('./routes');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use('/', router);
app.use((err, req, res, next) => {
  if (err._message == 'Movies validation failed') {
    return res.status(500).json({ error: 'Movies validation failed'});
  } else if (err._message == 'Users validation failed') {
    return res.status(500).json({ error: 'Users validation failed'});
  }

  return res.status(500).json(err);
})
app.listen(PORT, () => { console.log(`Running on Port ${PORT}`)});
