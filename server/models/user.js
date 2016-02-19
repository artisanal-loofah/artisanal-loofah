var db = require('../db');
var Sequelize = require('sequelize');
var Application = require('./application');

// Most fields populated from LinkedIn API
var User = db.define('Users', {
	first_name: Sequelize.STRING,
	last_name: Sequelize.STRING,
	email: Sequelize.STRING,
	headline: Sequelize.STRING, // title and company from LinkedIn API
	linkedin_id: Sequelize.STRING,
	picture_url: Sequelize.STRING
});

User.hasMany(Application, {
  foreignKey: 'user_id'
});

User.sync();
module.exports = User;