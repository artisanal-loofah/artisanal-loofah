var db = require('../db');
var Sequelize = require('sequelize');

var Backlog = db.define('Backlog', {
  application_id: Sequelize.INTEGER,
  notes: Sequelize.TEXT,
  status: Sequelize.STRING
});

module.exports = Backlog;