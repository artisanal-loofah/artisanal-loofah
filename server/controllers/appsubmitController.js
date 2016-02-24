var AppSubmit = require('../models/appsubmitModel');

module.exports = {

  addApp: function (request, response, next) {
    console.log('--------request body is : ', request.body)


    var newAppSubmit = {
      application_id: request.body.application_id//,
    //   notes: request.body.notes,
    //   status: request.body.status
    };

    AppSubmit.createNew(newAppSubmit, function (data) {
      console.log('new appsubmit was made')
      response.statusCode = 201;
      response.send();
    });
  },

  editApp: function (request, response, next) {
    AppSubmit.modify(request.body, function () {
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
    AppSubmit.getAllApps(request.query.userId, function (data) {
      response.statusCode = 200;
      console.log('function getallappsubmitted: ', data);
      response.send(data);
    })
  }
  
};