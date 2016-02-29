var pg = require('pg');
var Sequelize = require('sequelize');
var connectionString;

if (process.env.TEST) {
  connectionString = 'postgres://localhost:5432/hunttest';
} else {
  connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/hunt';
}

module.exports = new Sequelize(connectionString);