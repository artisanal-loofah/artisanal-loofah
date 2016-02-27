var Backlog = require('../db/schemas/backlog');


module.exports = {
  get: function (user_id, callback) {
    Backlog.findAll({ where: {user_id: user_id}})
      .then(function (backlogs) {
        callback(backlogs);
      });
  },

  create: function (backlog, callback) {
    Backlog.create(backlog)
      .then(function (backlog) {
        callback(backlog);
      });
  },

  update: function (newProps, callback) {
    Backlog.find({ where: { id: newProps.id } })
      .then(function (backlog) {
        if (backlog) {
          backlog.update(newProps)
            .then(function (backlog) {
              console.log('Backlog update function ran in backlog models, successfully updated backlog!');
              callback(backlog);
            });
        }
      })
      .catch(function (error) {
        console.error('Error from update:', error);
      });
  }
  
};
