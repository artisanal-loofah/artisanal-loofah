var Backlog = require('../db/schemas/backlog');


module.exports = {

  get: function (callback) {
    Backlog.findAll({})
      .then(function (backlogs) {
        callback(backlogs);
      });
  },

  getPending: function(callback) {
    Backlog.findAll({where: {status: 'Pending'} })
      .then(function (backlogs) {
        callback(backlogs);
      });
  },

  post: function (backlog, callback) {
    Backlog.create(backlog)
      .then(function (backlog) {
        console.log('Backlog post function ran in backlog models, successfully created backlog!');
        //need to pass backlog into the callback
        callback(backlog);
      });
  },

  update: function (newProps, callback) {
    // Currently, update function is searching for a matching 'notes' value,
    //  We need to make it search for a matching application_id 
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
