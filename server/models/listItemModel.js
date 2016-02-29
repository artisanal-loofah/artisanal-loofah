var Application = require('../models/applicationModel');
var _ = require('underscore');

// Extends the list item with job title and company name
var extendListItem = function(listItem, callback) {
  Application.getByAppId(listItem.application_id)
  .then(function(application) {
    listItem.dataValues = _.extend(listItem.dataValues, {'job_title': application.dataValues.job_title});
    return application.id;
  })
  .then(function(application_id) {
    return Application.getCompany(application_id);
  })
  .then(function(company) {
    listItem.dataValues = _.extend(listItem.dataValues, {'company': company.name});
    callback();
  })
};

module.exports = {
  // req.user attached from helper.decode method
  allListItems: function (req, res, listItemModel) {
    listItemModel.get(req.user.id, req.query.sort, function (listItems) {
      // Each listItem is extended with job title and company name
      // Response is only sent when all list items have been extended
      if (listItems.length) {
        var extendedCount = 0;
        listItems.forEach(function(listItem, index) {
          extendListItem(listItem, function() {
            extendedCount++;
            if (extendedCount === listItems.length) {
              res.json(listItems);
            }
          });
        });
      } else {
        // return an empty array if there are no listItems
        res.json([]);
      }
    });
  },
  addListItem: function (req, res, listItemModel) {
    // req.user attached from helper.decode method, we add the user_id to the body of the listItem request
    // After creating the new list item, the job title and company name are added to the list item response object
    req.body.user_id = req.user.id;
    listItemModel.create(req.body, function (listItem) {
      Application.getByAppId(listItem.application_id)
        .then(function(application) {
          extendListItem(listItem, application, function(listItem) {
            res.statusCode = 201;
            res.json(listItem);
          });
        })
        .catch(function (error) {
          console.log('Error in addListItem function in listItemModel: ', error);
        });
    });
  },
  updateListItem: function (req, res, listItemModel) {
    // After update, job title and company name are added to the list item response object
    listItemModel.update(req.body, function (listItem) {
      Application.getByAppId(listItem.application_id)
        .then(function(application) {
          extendListItem(listItem, application, function(listItem) {
            res.statusCode = 201;
            res.json(listItem);
          });
        });
    });
  }
};