var pg = require('pg');
var Sequelize = require('sequelize');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/hunt';

var db = new Sequelize(connectionString);

// Most fields populated from LinkedIn API
var User = db.define('Users', {
	first_name: Sequelize.STRING,
	last_name: Sequelize.STRING,
	email: Sequelize.STRING,
	headline: Sequelize.STRING, // title and company from LinkedIn API
	linkedin_id: Sequelize.STRING,
	picture_url: Sequelize.STRING
});

var Company = db.define('Companies', {
	name: Sequelize.STRING
});

var Application = db.define('Applications', {
	user_id: Sequelize.INTEGER,
	company_id: Sequelize.INTEGER,
  	job_title: Sequelize.STRING
});

var Backlog = db.define('Backlog', {
  application_id: Sequelize.INTEGER,
  notes: Sequelize.TEXT,
  status: Sequelize.String
});

var AppSubmit = db.define('AppSubmit', {
  application_id: Sequelize.INTEGER,
  notes: Sequelize.TEXT,
  status: Sequelize.String
});

User.hasMany(Application, {foreignKey: 'user_id'});
Application.belongsTo(User, {foreignKey: 'user_id'});

Company.hasMany(Application, {foreignKey: 'company_id'});
Application.belongsTo(Company, {foreignKey: 'company_id'});

Backlog.belongsTo(Application, {
  foreignKey: 'application_id',
  constraints: false
});
Application.hasMany(Backlog, {foreignKey: 'application_id'});

AppSubmit.belongsTo(Application, {
  foreignKey: 'application_id',
  constraints: false
});

Application.hasMany(AppSubmit, {foreignKey: 'application_id'});

var Offer = db.define('Offers', {
  application_id: Sequelize.INTEGER,
  salary: Sequelize.INTEGER,
  deadline: Sequelize.DATE,
  status: Sequelize.STRING,
  notes: Sequelize.TEXT
});

Offer.belongsTo(Application, {
  foreignKey: application_id,
  constraints: false
});
Application.hasOne(Offer);


var OnSite = db.define('OnSites', {
  application_id: Sequelize.INTEGER,
  interviewer: Sequelize.STRING,
  date_time: Sequelize.DATE,
  location: Sequelize.STRING,
  status:Sequelize.STRING,
  notes: Sequelize.TEXT
});

OnSite.belongsTo(Application, {
  foreignKey: application_id,
  constraints: false
});

Application.hasMany(OnSite);

var PhoneScreen = db.define('PhoneScreens', {
  application_id: Sequelize.INTEGER,
  interviewer: Sequelize.STRING,
  date_time: Sequelize.DATE,
  status:Sequelize.STRING,
  notes: Sequelize.TEXT
});

PhoneScreen.belongsTo(Application, {
  foreignKey: application_id,
  constraints: false
});

Application.hasMany(PhoneScreen);

User.sync();
Company.sync();
Application.sync();
Backlog.sync();
AppSubmit.sync();
PhoneScreen.sync();
OnSite.sync();
Offer.sync();

module.exports.User = User;
module.exports.Company = Company;
module.exports.Application = Application;
module.exports.Backlog = Backlog;
module.exports.AppSubmit = AppSubmit;
module.exports.PhoneScreen = PhoneScreen;
module.exports.OnSite = OnSite;
module.exports.Offer = Offer;
