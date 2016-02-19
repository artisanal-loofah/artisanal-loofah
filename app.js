var express = require('express');

// Database
var db = require('./server/db/db');

// Load schemas & relations
var relations = require('./server/db/relations')

// Middleware
var morgan = require('morgan');
var parser = require('body-parser');

// Router
var router = require('./server/routes.js');

var app = express();
module.exports.app = app;

// Set what we are listening on.
app.set('port', 3000);

// Logging and parsing
app.use(morgan('dev'));
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

// Set up our routes
// app.use('/classes', router);

// Serve the client files
// console.log(__dirname + '../../client');
app.use(express.static(__dirname + '/client'));

// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}
