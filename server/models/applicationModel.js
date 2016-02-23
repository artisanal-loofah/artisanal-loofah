var Application = require('../db/schemas/application');


module.exports = {
  get: function (user_id, callback) {
    Application.findAll({ where: {user_id: user_id}})
    .then(function(applications) {
      callback(applications);
    });
  },
  create: function (application, callback) {
    Application.create(application)
    .then(function(application){
      callback(application);
    });
  }
};
