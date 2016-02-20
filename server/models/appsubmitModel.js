var AppSubmit = require('../db/schemas/appsubmit');

module.exports = {

  createNew: function (data, callback) {
    AppSubmit.create(data).then(function (appSubmit) {
      callback(appSubmit.get('id'))
    })
  },

  getInfo: function (application_id, callback) {
    AppSubmit.findAll({ where: {application_id: application_id}})
    .then(function (app) {
      callback(app);
    });
  },

  getAllApps: function (callback) {
    AppSubmit.findAll({}).then(function (appsubmits) {
      callback(appsubmits);
    });
  },

  modify: function (data, callback) {
    AppSubmit.find({ where: {application_id: data.application_id}})
    .on('success', function (appsubmit) {
      if (appsubmit) {
        appsubmit.updateAttributes({
          notes: data.notes,
          status: data.status
        }).success(function () {
          console.log("appsubmit successfully updated");
          callback(appsubmit);
        });
      }
    })
  }

};

