var OnSite = require('../models/onSiteModel');

module.exports = {

  addOnSite: function (request, response, next) {
    var newOnSite = {
      user_id: request.body.user_id,
      application_id: request.body.application_id,
      interviewer: request.body.interviewer,
      date_time: request.body.date_time,
      location: request.body.location,
      notes: request.body.notes,
      status: request.body.status
    };

    OnSite.createNew(newOnSite, function () {
      console.log('new OnSite was made')
      response.statusCode = 201;
      response.end();
    });
  },

  editOnSite: function (request, response, next) {
    OnSite.modify(request.body, function () {
      response.statusCode = 204;
      response.end();
    })
  },

  getOnSite: function (request, response, next) {
    OnSite.getInfo(request.body.application_id, function (data) {
      response.statusCode = 200;
      response.send(data);
    });
  },

  getAllOnSites: function (request, response, next) {
    OnSite.getAllOnSites(request.query.userId, function (data) {
      response.statusCode = 200;
      response.send(data);
    })
  }
  
};