var db = require('../db');
var Sequelize = require('sequelize');

// Most fields populated from LinkedIn API
var User = db.define('Users', {
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  headline: Sequelize.STRING, // title and company from LinkedIn API
  linkedin_id: Sequelize.STRING,
  picture_url: Sequelize.STRING
});

module.exports = User;