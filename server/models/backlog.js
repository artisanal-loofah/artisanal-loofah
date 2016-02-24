var Backlog = require('../db/schemas/backlog');


module.exports = {

  get: function (user_id, callback) {
    Backlog.findAll({ where: {user_id: user_id}})
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
    // Currently, update function is searching for a matching 'notes' value,
    //  We need to make it search for a matching application_id 
    Backlog.find({ where: { application_id: newProps.application_id } })
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
        console.error('Error from udpate:', error);
      });
  }
  
};