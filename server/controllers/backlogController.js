var Backlog = require('../models/backlog');
var Application = require('../models/applicationModel');
var _ = require('underscore');

// extendBacklog adds the company name and job title to the backlog object
var extendBacklog = function(backlog, application, callback) {
  backlog.dataValues = _.extend(backlog.dataValues, {'job_title': application.dataValues.job_title});
    Application.getCompany(application.id)
      .then(function(company) {
        backlog.dataValues = _.extend(backlog.dataValues, {'company': company.name});
        callback(backlog);
      })
      .catch(function(error) {
        console.error(error);
      });
};

module.exports = {

  allBacklogs: function (req, res, next) {
    Backlog.get(req.query.userId, function (backlogs) {
      // Job title and company name are added to each backlog
      backlogs.forEach(function(backlog, index) {
        Application.getByAppId(backlog.application_id)
          .then(function(application) {
            extendBacklog(backlog, application, function(backlog) {
              if (index === backlogs.length - 1) {
                res.json(backlogs);
              }
            })
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

    // After creating the new Backlog item, the job title and company name are added to the backlog response object
    Backlog.post(newBacklog, function (backlog) {
      Application.getByAppId(backlog.application_id)
        .then(function(application) {
          extendBacklog(backlog, application, function(backlog) {
            res.statusCode = 201;
            res.json(backlog);
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
    };

    // After update, job title and company name are added to the backlog response object
    Backlog.update(updatedBacklog, function (backlog) {
      Application.getByAppId(backlog.application_id)
        .then(function(application) {
          extendBacklog(backlog, application, function(backlog) {
            res.statusCode = 201;
            res.json(backlog);
          });
        });
    });
  }

};