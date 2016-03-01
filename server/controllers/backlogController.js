var Backlog = require('../models/backlog');
var ListItem = require('../models/listItemModel');


module.exports = {
  allBacklogs: function(req, res) {
    ListItem.allListItems(req, res, Backlog);
  },
  addBacklog: function(req, res) {
    ListItem.addListItem(req, res, Backlog);
  },
  updateBacklog: function(req, res) {
    ListItem.updateListItem(req, res, Backlog);
  }
};
