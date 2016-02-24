var AppSubmit = require('../db/schemas/appsubmit');

module.exports = {

  createNew: function (data, callback) {
    AppSubmit.create(data).then(function (appSubmit) {
      console.log('appsubmit from the db: ', appSubmit);
      
      callback(appSubmit.get('id'))
    })
  },

  getInfo: function (application_id, callback) {
    AppSubmit.findOne({ where: {application_id: application_id}})
    .then(function (app) {
      callback(app);
    });
  },

  getAllApps: function (user_id, callback) {
    AppSubmit.findAll({ where: {user_id: user_id}}).then(function (appsubmits) {
      callback(appsubmits);
    });
  },

  modify: function (data, callback) {
    AppSubmit.findOne({ where: {application_id: data.application_id}})
    .on('success', function (appsubmit) {
      if (appsubmit) {
        appsubmit.update(data)
        .success(function () {
          console.log("appsubmit successfully updated");
          callback();
        });
      }
    })
  }

};
