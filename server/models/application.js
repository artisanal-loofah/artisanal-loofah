var db = require('../db');
var Sequelize = require('sequelize');
var User = require('./user');
var Company = require('./company');
var Backlog = require('./backlog');
var AppSubmit = require('./appsubmit');
var Offer = require('./offer');
var OnSite = require('./onsite');
var PhoneScreen = require('./phonescreen');

var Application = db.define('Applications', {
	user_id: Sequelize.INTEGER,
	company_id: Sequelize.INTEGER,
  job_title: Sequelize.STRING
});

Application.belongsTo(User, {
  foreignKey: 'user_id'
});

Application.belongsTo(Company, {
  foreignKey: 'company_id'
});

Application.hasOne(Backlog, {
  foreignKey: 'application_id'
});

Application.hasOne(AppSubmit, {
  foreignKey: 'application_id'
});

Application.hasOne(Offer);
Application.hasMany(OnSite);
Application.hasMany(PhoneScreen);

Application.sync();
module.exports= Application;