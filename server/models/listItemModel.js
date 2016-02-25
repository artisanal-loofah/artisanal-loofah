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
    console.log('-------------ADDING LSIT ITEM');
    console.log(req.body);

    // After creating the new list item, the job title and company name are added to the list item response object
    listItemModel.create(req.body, function (listItem) {
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
    console.log('------UPDATING LIST ITEM');
    console.log(req.body);

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