var Backlog = require('../models/backlog')

module.exports = {

  allBacklogs: function (req, res, next) {
    Backlog.get(req.query.userId, function (backlogs) {
      res.json(backlogs);
    });
  },

  newBacklog: function (req, res) {
    var newBacklog = {
      user_id: req.body.userId,
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