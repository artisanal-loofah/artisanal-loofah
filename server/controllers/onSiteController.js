var OnSite = require('../models/onSiteModel');
var ListItem = require('../models/listItemModel');

module.exports = {
  allOnSites: function(req, res) {
    ListItem.allListItems(req, res, OnSite);
  },

  addOnSite: function(req, res) {
    ListItem.addListItem(req, res, OnSite);
  },

  updateOnSite: function(req, res) {
    ListItem.updateListItem(req, res, OnSite);
  }


  // getAOnSite: function (request, response, next) {
  //   OnSite.getOne(request.body, function (data) {
  //     response.statusCode = 200;
  //     response.send(data);
  //   });
  // }

};
