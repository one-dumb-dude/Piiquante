require('dotenv').config();
const userRoutes = require('./routes/users');
const express = require("express");
const mongoose = require("mongoose");
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

app.use(express.urlencoded());

app.use('/api/users', userRoutes);
app.listen(port, () => {
  console.log('Running piiquante node server on ', port)
});
