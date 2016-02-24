var Application = require('../db/schemas/application');
var Company = require('../db/schemas/company');

module.exports = {
  get: function (user_id, callback) {
    Application.findAll({ where: {user_id: user_id}})
    .then(function(applications) {
      callback(applications);
    });
  },
  getByAppId: function(application_id) {
    return Application.find( {where: {id: application_id}});
  },
  create: function (application, callback) {
    Application.create(application)
    .then(function(application){
      callback(application);
    });
  },
  getCompany: function(application_id) {
    return Application.find({ where: {id: application_id}})
    .then(function(application) {
      return Company.find({ where: {id: application.company_id}})
    });
  }
};
