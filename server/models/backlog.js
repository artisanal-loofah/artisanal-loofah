var Backlog = require('../db/schemas/backlog');
var db = require('../db/db.js');
var Sequelize = require('sequelize');

module.exports = {

  get: function(callback) {
    Backlog.findAll({})
      .then(function(backlogs) {
        callback(backlogs);
      });
  },

  /*comment out each getPending function and uncomment the next ones to see functionality by refreshing the l
  localhost:3000 page, you should see the back log on the right hand side update The first method gets all users
  second gets all backlogs specific to user with id of 1 third one doesn't work because collumn doesn't exist
  */

  getPending: function(callback) {
    Backlog.findAll({ where: { status: 'Pending' } })
      .then(function(backlogs) {
        callback(backlogs);
      });
  },

  // getPending: function(callback) {
  //   console.log('inside get pending');
  //   db.query('Select "C".name, "A".job_title, "B".id, "B".status, "B".notes from "Backlogs" as "B" inner join "Applications" as "A" on "B".application_id = "A".id inner join "Companies" as "C" on "C".id = "A".company_id WHERE "A".user_id = 1;', { type: Sequelize.QueryTypes.SELECT })
  //     .then(function(backlogs) {
  //       callback(backlogs);
  //     });
  // },

  // getPending: function(callback) {
  //   console.log('inside get pending');
  //   db.query('Select "C".name, "A".job_title, "B".id, "B".status, "B".notes from "Backlogs" as "B" inner join "Applications" as "A" on "B".application_id = "A".id inner join "Companies" as "C" on "C".id = "A".company_id WHERE "A".user_id = 1 and "B".status = "Pending";', { type: Sequelize.QueryTypes.SELECT })
  //     .then(function(backlogs) {
  //       callback(backlogs);
  //     });
  // },

  post: function(backlog, callback) {
    Backlog.create(backlog)
      .then(function(backlog) {
        console.log('Backlog post function ran in backlog models, successfully created backlog!');
        //need to pass backlog into the callback
        callback(backlog);
      });
  },

  update: function(newProps, callback) {
    // Currently, update function is searching for a matching 'notes' value,
    //  We need to make it search for a matching application_id 
    Backlog.find({ where: { notes: newProps.notes } })
      .then(function(backlog) {
        if (backlog) {
          console.log('update found');
          backlog.update(newProps)
            .then(function(backlog) {
              console.log('Backlog update function ran in backlog models, successfully updated backlog!');
              callback();
            });
        }
      })
      .catch(function(error) {
        console.error('Error from udpate:', error);
      });
  }

};
