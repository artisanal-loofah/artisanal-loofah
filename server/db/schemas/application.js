var db = require('../db');
var Sequelize = require('sequelize');

var Application = db.define('Applications', {
	user_id: Sequelize.INTEGER,
	company_id: Sequelize.INTEGER,
	job_title: Sequelize.STRING
});

module.exports= Application;