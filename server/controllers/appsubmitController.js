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
      response.statusCode = 200;
      response.end();
    });
  },

  editApp: function (request, response, next) {
    AppSubmit.modify(request.body.application_id, function () {
      response.statusCode = 204;
      response.end();
    })
  },

  getApp: function (request, response, next) {
    AppSubmit.getInfo(request.body.application_id, function (data) {
      response.statusCode = 200;
      response.send(data);
    });
  },

  getAllApps: function (request, response, next) {
    AppSubmit.getAllApps(function (data) {
      response.statusCode = 200;
      response.send(data);
    })
  }
  
};