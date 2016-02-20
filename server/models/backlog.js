var Backlog = require('../db/schemas/backlog');


module.exports = {

  get: function (callback) {
    Backlog.findAll({})
      .then(function (backlogs) {
        callback(backlogs);
      });
  },

  post: function (backlog, callback) {
    Backlog.create(backlog)
      .then(function (backlog) {
        console.log('Backlog post function ran in backlog models, successfully created backlog!');
        callback();
      });
  },

  update: function (newProps, callback) {
    console.log('hitting update');
    Backlog.find({ where: { notes: newProps.notes } })
      .then(function (backlog) {
        if (backlog) {
          console.log('update found');
          backlog.update(newProps)
            .then(function (backlog) {
              console.log('Backlog update function ran in backlog models, successfully updated backlog!');
              callback();
            });
        }
      })
      .catch(function (error) {
        console.error('Error from udpate:', error);
      });
  }
  
};
