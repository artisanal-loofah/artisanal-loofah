var db = require('../db');
var Sequelize = require('sequelize');
var Application = require('./application');

var OnSite = db.define('OnSites', {
  application_id: Sequelize.INTEGER,
  interviewer: Sequelize.STRING,
  date_time: Sequelize.DATE,
  location: Sequelize.STRING,
  status:Sequelize.STRING,
  notes: Sequelize.TEXT
});

OnSite.belongsTo(Application, {
  foreignKey: application_id,
  constraints: false
});

OnSite.sync();
module.exports = OnSite;