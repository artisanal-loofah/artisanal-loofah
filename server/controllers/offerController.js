var Offer = require('../models/offerModel.js');
var ListItem = require('../models/listItemModel');

module.exports = {
  
  allOffers: function(req, res) {
    ListItem.allListItems(req, res, Offer);
  },
  updateOffer: function(req, res) {
    ListItem.updateListItem(req, res, Offer);
  }

};
