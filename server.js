const express = require('express')
const mongoose = require('mongoose')
const api = require('./server/routes/api')
const PORT = process.env.PORT || 4200;
const URI = process.env.MONGODB_URI || 'mongodb://localhost/roomsDB';
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', api)

mongoose.connect(URI,
  {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000})
  .then(function() {
      app.listen(PORT, function() {
          console.log(`Server is up and running on port: ${PORT}`);
      });
  })
  .catch(function(err) {
      console.log(err.message);
  });