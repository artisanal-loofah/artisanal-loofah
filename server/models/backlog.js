var db = require('../db');
var Sequelize = require('sequelize');
var Application = require('./application');

var Backlog = db.define('Backlog', {
  application_id: Sequelize.INTEGER,
  notes: Sequelize.TEXT,
  status: Sequelize.String
});

Backlog.belongsTo(Application, {
  foreignKey: 'application_id',
  constraints: false
});

Backlog.sync();
module.exports = Backlog;