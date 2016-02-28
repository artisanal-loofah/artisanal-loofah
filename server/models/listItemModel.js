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
      if (listItems.length) {
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
      } else {
        res.end();
      }
    });
  },
  addListItem: function (req, res, listItemModel) {
    // After creating the new list item, the job title and company name are added to the list item response object
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