var db = require('../db');
var Sequelize = require('sequelize');

var Backlog = db.define('Backlog', {
  user_id: Sequelize.INTEGER,
  application_id: Sequelize.INTEGER,
  notes: Sequelize.TEXT,
  status: Sequelize.STRING
});

module.exports = Backlog;