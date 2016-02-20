var PhoneScreen = require('../models/phoneScreenModel')

module.exports = {

  addPhoneScreen: function (request, response, next) {
    var newPhoneScreen = {
      application_id: request.body.application_id,
      interviewer: request.body.interviewer,
      date_time: request.body.date_time,
      notes: request.body.notes,
      status: request.body.status
    };

    PhoneScreen.createNew(newPhoneScreen, function () {
      console.log('a new phonescreen was added');
      response.statusCode = 201;
      response.end();
    });
  },

  editPhoneScreen: function (request, response, next) {
    PhoneScreen.modify(request.body, function () {
      response.statusCode = 204;
      response.end();
    });
  },

  getAllPhoneScreens: function (request, response, next) {
    PhoneScreen.getAllPhoneScreens(function (data) {
      response.statusCode = 200;
      response.send(data);
    });
  },

  getAPhoneScreen: function (request, response, next) {
    PhoneScreen.getOne(request.body, function (data) {
      response.statusCode = 200;
      response.send(data);
    });
  }

};