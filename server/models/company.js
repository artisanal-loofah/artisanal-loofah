var db = require('../db');
var Sequelize = require('sequelize');
var Application = require('./application');

var Company = db.define('Companies', {
	name: Sequelize.STRING
});

Company.hasMany(Application, {
  foreignKey: 'company_id'
});

Company.sync();
module.exports = Company;