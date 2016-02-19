var db = require('../db');
var Sequelize = require('sequelize');
var Application = require('./application');

var PhoneScreen = db.define('PhoneScreens', {
  application_id: Sequelize.INTEGER,
  interviewer: Sequelize.STRING,
  date_time: Sequelize.DATE,
  status:Sequelize.STRING,
  notes: Sequelize.TEXT
});

PhoneScreen.belongsTo(Application, {
  foreignKey: application_id,
  constraints: false
});

PhoneScreen.sync();
module.exports = PhoneScreen;