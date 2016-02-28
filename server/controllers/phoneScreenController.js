var PhoneScreen = require('../models/phoneScreenModel');
var ListItem = require('../models/listItemModel');

module.exports = {
  allPhoneScreens: function(req, res) {
    ListItem.allListItems(req, res, PhoneScreen);
  },

  addPhoneScreen: function(req, res) {
    ListItem.addListItem(req, res, PhoneScreen);
  },

  updatePhoneScreen: function(req, res) {
    ListItem.updateListItem(req, res, PhoneScreen);
  }
};
