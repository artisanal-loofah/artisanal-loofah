var AppSubmit = require('../models/appsubmitModel');

module.exports = {

  addApp: function (request, response, next) {

    var newappSubmit = {
      application_id: request.body.application_id,
      notes: request.body.notes,
      status: request.body.status
    };

    AppSubmit.createNew(newAppSubmit, function () {
      console.log('new appsubmit was made')
      response.statusCode = 201;
      response.end();
    })
  },

  getApp: function (request, response, next) {

  },

  editApp: function (request, response, next) {

  }

};