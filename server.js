// required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// server parameters
const app = express();
const port = process.env.PORT || 3000;

//created model loading here
pet = require('./api/models/petModel');
order = require('./api/models/orderModel');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/PetStore-SwaggerIO');
//
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//importing route
var petRoutes = require('./api/routes/petRoutes');
var storeRoutes = require('./api/routes/storeRoutes')

//register the route
petRoutes(app);
storeRoutes(app);

// handle invalid url requests
app.use(function(req, res) {
  console.log(req.originalUrl);
  console.log(req.body);
  res.status(404).send({url: req.originalUrl + ' not found'});
});

app.listen(port, function(){
  console.log('Pet Store RESTful API server started on: ' + port);
});
