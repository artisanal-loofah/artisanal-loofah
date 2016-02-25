var Backlog = require('../models/backlog');
var Application = require('../models/applicationModel');
var ListItem = require('../models/listItemModel');
var _ = require('underscore');


module.exports = {
  allBacklogs: function(req, res) {
    ListItem.allListItems(req, res, Backlog);
  },
  addBacklog: function(req, res) {
    ListItem.addListItem(req, res, Backlog);
  },
  removeBacklog: function () {

  },
  updateBacklog: function(req, res) {
    ListItem.updateListItem(req, res, Backlog);
  }
};