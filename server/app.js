var express = require('express');

// Database
var db = require('./db');

// Load models
var User = require('./models/user');
var Company = require('./models/company');
var Application = require('./models/application');
var Backlog = require('./models/backlog');
var AppSubmit = require('./models/appsubmit');
var PhoneScreen = require('./models/phonescreen');
var OnSite = require('./models/onsite');
var Offer = require('./models/Offer');

// Middleware
var morgan = require('morgan');
var parser = require('body-parser');

// Router
var router = require('./routes.js');

var app = express();
module.exports.app = app;

// Set what we are listening on.
app.set('port', 3000);

// Logging and parsing
app.use(morgan('dev'));
app.use(parser.json());

// Set up our routes
// app.use('/classes', router);

// Serve the client files
app.use(express.static(__dirname + '/../client'));

// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}