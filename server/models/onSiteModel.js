var OnSite = require('../db/schemas/onsite');

module.exports = {
  get: function (user_id, callback) {
    OnSite.findAll({ where: {user_id: user_id}})
      .then(function (onSites) {
        callback(onSites);
      });
  },

  create: function (onSite, callback) {
    OnSite.create(onSite)
      .then(function (onSite) {
        callback(onSite);
      });
  },

  update: function (newProps, callback) {
    OnSite.findOne({ where: {id: newProps.id}})
      .then(function (onSite) {
        if (onSite) {
          onSite.update(newProps)
          .then(function (onSite) {
            console.log("onsite successfully updated");
            callback(onSite);
          });
        }
      })
      .catch(function (error) {
        console.error('Error from update:', error);
      })
  }
};
