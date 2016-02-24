var Backlog = require('../models/backlog');
var Application = require('../models/applicationModel');
var _ = require('underscore');

module.exports = {

  allBacklogs: function (req, res, next) {
    Backlog.get(req.query.userId, function (backlogs) {
      // Job title and company name are added to the response object for each backlog
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
              })
              .catch(function(error) {
                console.error(error);
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

    // After creating the new Backlog item, the job title and company name are added to the response object
    Backlog.post(newBacklog, function (backlog) {
      Application.getByAppId(backlog.application_id)
        .then(function(application) {
          backlog.dataValues = _.extend(backlog.dataValues, {'job_title': application.dataValues.job_title});
          Application.getCompany(application.id)
            .then(function(company) {
              backlog.dataValues = _.extend(backlog.dataValues, {'company': company.name});
              res.statusCode = 201;
              res.json(backlog);
            })
            .catch(function(error) {
              console.error(error);
            });
        });
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
      Application.getByAppId(backlog.application_id)
        .then(function(application) {
          backlog.dataValues = _.extend(backlog.dataValues, {'job_title': application.dataValues.job_title});
            Application.getCompany(application.id)
              .then(function(company) {
                backlog.dataValues = _.extend(backlog.dataValues, {'company': company.name});
                res.statusCode = 201;
                res.json(backlog);
              })
              .catch(function(error) {
                console.error(error);
              });
        });
    });
  }

};