var Application = require('../db/schemas/application');

module.exports = {
  post: function (application, callback) {
    Application.create(application).then(function(newApplication){
      callback(newApplication);
    });
  }
};
