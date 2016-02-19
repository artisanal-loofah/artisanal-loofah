var db = require('../db');
var Sequelize = require('sequelize');

var OnSite = db.define('OnSites', {
  application_id: Sequelize.INTEGER,
  interviewer: Sequelize.STRING,
  date_time: Sequelize.DATE,
  location: Sequelize.STRING,
  status:Sequelize.STRING,
  notes: Sequelize.TEXT
});

module.exports = OnSite;