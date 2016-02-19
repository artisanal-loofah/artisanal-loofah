var pg = require('pg');
var Sequelize = require('sequelize');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/hunt';

var sequelize = new Sequelize(connectionString);

// Most fields populated from LinkedIn API
var User = db.define('users', {
	first_name: Sequelize.STRING,
	last_name: Sequelize.STRING,
	email: Sequelize.STRING,
	headline: Sequelize.STRING, // title and company from LinkedIn API
	linkedin_id: Sequelize.STRING,
	picture_url: Sequelize.STRING
});

var Company = db.define('companies', {
	name: Sequelize.STRING
});

var Application = db.define('applications', {
	user_id: Sequelize.INTEGER,
	company_id: Sequelize.INTEGER,
  	job_title: Sequelize.STRING
});

var Backlog = db.define('Backlog', {
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

User.sync();
Company.sync();
Application.sync();
Backlog.sync();

module.exports.User = User;
module.exports.Company = Company;
module.exports.Application = Application;
module.exports.Backlog = Backlog;
