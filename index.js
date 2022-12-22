const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const entry = require('./routes/index');
app.use(bodyParser.json());
require('dotenv').config();



mongoose.connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(process.env.PORT);
    console.log("Db is connected")
    console.log("listening on port", process.env.PORT)
    
    app.use('/', entry);
  })
  .catch((error) => {
  
    console.log("Db not connected")
    console.log(error)
  });;




