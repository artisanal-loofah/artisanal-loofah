var pg = require('pg');
var Sequelize = require('sequelize');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/hunt';

var sequelize = new Sequelize(connectionString);

var Backlog = db.define('Backlog', {
  id: Sequelize.INTEGER,
  application_id: Sequelize.INTEGER,
  notes: Sequelize.TEXT,
  status: Sequelize.String
});

Backlog.belongsTo(Application, {
  foreignKey: 'application_id',
  constraints: false
});