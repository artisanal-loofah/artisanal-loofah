var AppSubmit = require('../db/schemas/appsubmit');

module.exports = {

  createNew: function (data, callback) {
    AppSubmit.create(data).then(function (app) {
      callback(app.get('application_id'))
    })
  },

  getInfo: function (application_id, callback) {
    AppSubmit.findAll({ where: {application_id: application_id}})
    .then(function (app) {
      callback(app);
    });
  }

};

