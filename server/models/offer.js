var db = require('../db');
var Sequelize = require('sequelize');
var Application = require('./application');

var Offer = db.define('Offers', {
  application_id: Sequelize.INTEGER,
  salary: Sequelize.INTEGER,
  deadline: Sequelize.DATE,
  status: Sequelize.STRING,
  notes: Sequelize.TEXT
});

Offer.belongsTo(Application, {
  foreignKey: application_id,
  constraints: false
});

Offer.sync();
module.exports = Offer;