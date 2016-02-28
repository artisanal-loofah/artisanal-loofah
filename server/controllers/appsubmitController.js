var AppSubmit = require('../models/appsubmitModel');
var ListItem = require('../models/listItemModel');

module.exports = {

  allAppSubmits: function(req, res) {
    ListItem.allListItems(req, res, AppSubmit);
  },

  addAppSubmit: function(req, res) {
    ListItem.addListItem(req, res, AppSubmit);
  },

  updateAppSubmit: function(req, res) {
    ListItem.updateListItem(req, res, AppSubmit);
  }
};
