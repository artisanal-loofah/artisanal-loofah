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
    });
  },

  getApp: function (request, response, next) {
    AppSubmit.getInfo(request.body.application_id, function (data) {
      response.statusCode = 201;
      response.send(data);
    });
  },

  editApp: function (request, response, next) {
    AppSubmit.modify(request.body.application_id, function () {
      response.statusCode = 201;
      response.end();
    })
  }

};