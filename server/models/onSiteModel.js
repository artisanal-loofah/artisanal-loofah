var OnSite = require('../db/schemas/onsite');

module.exports = {

  createNew: function (data, callback) {
    OnSite.create(data).then(function (onSite) {
      callback(onSite.get('id'))
    });
  },

  getInfo: function (application_id, callback) {
    OnSite.findOne({ where: {application_id: application_id}})
    .then(function (onSite) {
      callback(onSite);
    });
  },

  getAllOnSites: function (user_id, callback) {
    OnSite.findAll({ where: {user_id: user_id}}).then(function (onSites) {
      callback(onSites);
    });
  },

  modify: function (data, callback) {
    OnSite.findOne({ where: {application_id: data.application_id}})
    .on('success', function (onSite) {
      if (onSite) {
        onSite.update(data)
        .success(function () {
          console.log("onsite successfully updated");
          callback();
        });
      }
    });
  }

};

