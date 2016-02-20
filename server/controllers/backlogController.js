var Backlog = require('../models/backlog')

module.exports = {

  allBacklogs: function (req, res, next) {
    Backlog.get(function (backlogs) {
      res.json(backlogs);
    });
  },

  newBacklog: function (req, res) {
    var userData = req.body;

    var newBacklog = {
      notes: userData.notes,
      status: userData.status
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
    var userData = req.body;

    var updatedBacklog = {
      notes: userData.notes,
      status: userData.status
    }

    Backlog.update(updatedBacklog, function () {
      console.log('updatedBacklog function in server ctrl executed..');
      res.statusCode = 201;
      res.end();
    });
  }

};