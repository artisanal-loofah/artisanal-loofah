var User = require('./schemas/user');
var Application = require('./schemas/application');
var Company = require('./schemas/company');
var Backlog = require('./schemas/backlog');
var AppSubmit = require('./schemas/appsubmit');
var PhoneScreen = require('./schemas/phonescreen');
var OnSite = require('./schemas/onsite');
var Offer = require('./schemas/offer');

User.hasMany(Application, {
  foreignKey: 'user_id'
});
User.hasMany(Backlog, {
  foreignKey: 'user_id'
});
User.hasMany(AppSubmit, {
  foreignKey: 'user_id'
});
User.hasMany(PhoneScreen, {
  foreignKey: 'user_id'
});
User.hasMany(OnSite, {
  foreignKey: 'user_id'
});
User.hasMany(Offer, {
  foreignKey: 'user_id'
});


Company.hasMany(Application, {
  foreignKey: 'company_id'
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
Application.hasOne(Offer, {
  foreignKey: 'application_id'
});
Application.hasMany(OnSite, {
  foreignKey: 'application_id'
});
Application.hasMany(PhoneScreen, {
  foreignKey: 'application_id'
});

Backlog.belongsTo(User, {
  foreignKey: 'user_id',
  constraints: false
});
AppSubmit.belongsTo(User, {
  foreignKey: 'user_id',
  constraints: false
});
PhoneScreen.belongsTo(User, {
  foreignKey: 'user_id',
  constraints: false
});
OnSite.belongsTo(User, {
  foreignKey: 'user_id',
  constraints: false
});
Offer.belongsTo(User, {
  foreignKey: 'user_id',
  constraints: false
});


Backlog.belongsTo(Application, {
  foreignKey: 'application_id',
  constraints: false
});
AppSubmit.belongsTo(Application, {
  foreignKey: 'application_id',
  constraints: false
});
PhoneScreen.belongsTo(Application, {
  foreignKey: 'application_id',
  constraints: false
});
OnSite.belongsTo(Application, {
  foreignKey: 'application_id',
  constraints: false
});
Offer.belongsTo(Application, {
  foreignKey: 'application_id',
  constraints: false
});


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
module.exports.Offer = Offer;
module.exports.OnSite = OnSite;
module.exports.PhoneScreen = PhoneScreen;