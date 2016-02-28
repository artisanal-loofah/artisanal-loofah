var Offer = require('../models/offerModel');
var ListItem = require('../models/listItemModel');


module.exports = {
  allOffers: function(req, res) {
    ListItem.allListItems(req, res, Offer);
  },
  addOffer: function(req, res) {
    ListItem.addListItem(req, res, Offer);
  },
  removeOffer: function () {

  },
  updateOffer: function(req, res) {
    ListItem.updateListItem(req, res, Offer);
  }
};
