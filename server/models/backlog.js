var Backlog = require('../db/schemas/backlog');


module.exports = {

  get: function (callback) {
    Backlog.find({})
      .then(function(backlogs) {
        callback(backlogs);
      });
  },

  post: function (backlog, callback) {
    Backlog.create(backlog)
      .then(function(backlog){
        console.log('Backlog post function ran in backlog models, successfully created backlog!');
        callback();
    });
  }
  
};
