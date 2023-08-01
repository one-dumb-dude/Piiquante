require('dotenv').config();
const authRoutes = require('./routes/auth');
const sauceRoutes = require('./routes/sauce');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.log('Unable to connect to MondgoDB Atleast');
    console.error(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const whitelist = ['http://localhost:4200'];
const corOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corOptions));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRoutes);
app.use('/api/sauces', sauceRoutes)
app.listen(port, () => {
  console.log('Running piiquante node server on ', port)
});
