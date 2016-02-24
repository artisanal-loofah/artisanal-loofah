var db = require('../db');
var Sequelize = require('sequelize');

var AppSubmit = db.define('AppSubmit', {
  user_id: Sequelize.INTEGER,
  application_id: Sequelize.INTEGER,
  notes: Sequelize.TEXT,
  status: Sequelize.STRING
});

module.exports = AppSubmit;