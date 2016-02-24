var db = require('../db');
var Sequelize = require('sequelize');

var Offer = db.define('Offers', {
  user_id: Sequelize.INTEGER,
  application_id: Sequelize.INTEGER,
  salary: Sequelize.INTEGER,
  deadline: Sequelize.DATE,
  status: Sequelize.STRING,
  notes: Sequelize.TEXT
});

module.exports = Offer;