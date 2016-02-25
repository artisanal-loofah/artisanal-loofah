var Application = require('../models/applicationModel');
var _ = require('underscore');

var extendListItem = function(listItem, application, callback) {
  listItem.dataValues = _.extend(listItem.dataValues, {'job_title': application.dataValues.job_title});
    Application.getCompany(application.id)
      .then(function(company) {
        listItem.dataValues = _.extend(listItem.dataValues, {'company': company.name});
        callback(listItem);
      })
      .catch(function(error) {
        console.error(error);
      });
};

module.exports = {
  allListItems: function (req, res, listItemModel) {
    listItemModel.get(req.query.userId, function (listItems) {
      // Job title and company name are added to each listItem
      listItems.forEach(function(listItem, index) {
        Application.getByAppId(listItem.application_id)
          .then(function(application) {
            extendListItem(listItem, application, function(listItem) {
              if (index === listItems.length - 1) {
                res.json(listItems);
              }
            })
          });
      });
    });
  },
  addListItem: function (req, res, listItemModel) {
    var newListItem = {
      user_id: req.body.user_id,
      application_id: req.body.application_id,
      notes: req.body.notes,
      status: req.body.status
    }

    // After creating the new list item, the job title and company name are added to the list item response object
    listItemModel.post(newListItem, function (listItem) {
      Application.getByAppId(listItem.application_id)
        .then(function(application) {
          extendListItem(listItem, application, function(listItem) {
            res.statusCode = 201;
            res.json(listItem);
          });
        });
    });
  },
  updateListItem: function (req, res, listItemModel) {
    var updatedListItem = {
      id: req.body.id,
      notes: req.body.notes,
      status: req.body.status
    };

    // After update, job title and company name are added to the list item response object
    listItemModel.update(updatedListItem, function (listItem) {
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