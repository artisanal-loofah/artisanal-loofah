var db = require('../db');
var Sequelize = require('sequelize');

var AppSubmit = db.define('AppSubmit', {
  application_id: Sequelize.INTEGER,
  notes: Sequelize.TEXT,
  status: Sequelize.STRING
});

module.exports = AppSubmit;