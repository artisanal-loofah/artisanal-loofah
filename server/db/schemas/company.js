var db = require('../db');
var Sequelize = require('sequelize');

var Company = db.define('Companies', {
	name: Sequelize.STRING
});

module.exports = Company;