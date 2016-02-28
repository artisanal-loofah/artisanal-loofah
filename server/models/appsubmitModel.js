var AppSubmit = require('../db/schemas/appsubmit');

module.exports = {
  get: function (user_id, callback) {
    AppSubmit.findAll({ where: {user_id: user_id}})
      .then(function (appSubmits) {
        callback(appSubmits);
      });
  },

  create: function (appSubmit, callback) {
    AppSubmit.create(appSubmit)
      .then(function (appSubmit) {
        callback(appSubmit)
      });
  },

  update: function (newProps, callback) {
    AppSubmit.find({ where: {id: newProps.id}})
    .then(function (appSubmit) {
      if (appSubmit) {
        appSubmit.update(newProps)
          .then(function (appSubmit) {
            console.log("appsubmit successfully updated");
            callback(appSubmit);
          });
      }
    })
    .catch(function(error) {
      console.error('Error from update: ', error);
    });
  }

};
