var db = require('../db');
var Sequelize = require('sequelize');
var Application = require('./application');

var AppSubmit = db.define('AppSubmit', {
  application_id: Sequelize.INTEGER,
  notes: Sequelize.TEXT,
  status: Sequelize.String
});

AppSubmit.belongsTo(Application, {
  foreignKey: 'application_id',
  constraints: false
});

AppSubmit.sync();
module.exports = AppSubmit;