var Backlog = require('../db/schemas/backlog');


module.exports = {
  // Returns all list items. Order is determined by sort variable.
  get: function (user_id, sort, callback) {
    switch(sort) {
      case undefined:
      case 'created':
        Backlog.findAll({
          where: {
            user_id: user_id,
            $not: {status: 'Removed'}
          },
          order: [['createdAt', 'ASC']]
        })
        .then(function (backlogs) {
          callback(backlogs);
        });
        break;

      case 'pending':
        Backlog.findAll({
          where: {
            user_id: user_id,
            status: 'Pending',
            $not: {
              status: ['Removed', 'Rejected']
            }
          },
          order: 'status DESC'
        })
        .then(function (backlogs) {
          callback(backlogs);
        });
        break;
    }
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
              callback(backlog);
            });
        }
      })
      .catch(function (error) {
        console.error('Error from update:', error);
      });
  }
  
};
