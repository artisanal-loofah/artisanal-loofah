var express = require('express');

// Database
var db = require('./server/db/db');

// Load schemas & relations
var relations = require('./server/db/relations');

// Middleware
var morgan = require('morgan');
var parser = require('body-parser');


var app = express();
module.exports.app = app;

// Set what we are listening on.
app.set('port', 3000);

<<<<<<< ff09c080fd98b5a3337d1561df5a46fb0ce25add
=======
app.use(morgan('dev'));
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

// Router
var router = require('./server/routes');
app.use(router);

>>>>>>> edit app.js to move middle wear
// Logging and parsing

// Router
var router = require('./server/routes');
app.use(router);


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
