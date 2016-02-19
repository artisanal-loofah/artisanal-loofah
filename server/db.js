var pg = require('pg');
var Sequelize = require('sequelize');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/hunt';

var sequelize = new Sequelize(connectionString);

var AppSubmit = db.define('AppSubmit', {
  application_id: Sequelize.INTEGER,
  notes: Sequelize.TEXT,
  status: Sequelize.String
});

AppSubmit.belongsTo(Application, {
  foreignKey: 'application_id',
  constraints: false
});