var Backlog = require('../models/backlog');
var Application = require('../models/applicationModel');
var _ = require('underscore');

module.exports = {

  allBacklogs: function (req, res, next) {
    Backlog.get(req.query.userId, function (backlogs) {

      backlogs.forEach(function(backlog, index) {
        Application.getByAppId(backlog.application_id)
        .then(function(application) {

          backlog.dataValues = _.extend(backlog.dataValues, {'job_title': application.dataValues.job_title});
          Application.getCompany(application.id)
          .then(function(company) {
            backlog.dataValues = _.extend(backlog.dataValues, {'company': company.name});
            if (index === backlogs.length - 1) {
              res.json(backlogs);
            }
          });
        });
      });
    });
  },

  newBacklog: function (req, res) {
    var newBacklog = {
      user_id: req.body.user_id,
      application_id: req.body.application_id,
      notes: req.body.notes,
      status: req.body.status
    }

    Backlog.post(newBacklog, function () {
      console.log('newBacklog function in server ctrl executed...');
      res.statusCode = 201;
      res.end();
    });
  },

  removeBacklog: function () {

  },

  updateBacklog: function (req, res) {
    console.log('user data from update: ', req.body);
    var userData = req.body;

    var updatedBacklog = {
      id: userData.id,
      notes: userData.notes,
      status: userData.status
    }

    Backlog.update(updatedBacklog, function (backlog) {
      console.log('updatedBacklog function in server ctrl executed..');
      res.statusCode = 201;
      res.json(backlog);
    });
  }

};