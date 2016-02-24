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
        callback(backlog);
      });
  },

  update: function (newProps, callback) {
    // Currently, update function is searching for a matching 'notes' value,
    //  We need to make it search for a matching application_id 
    Backlog.find({ where: { id: newProps.id } })
      .then(function (backlog) {
        if (backlog) {
          console.log('update found');
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
