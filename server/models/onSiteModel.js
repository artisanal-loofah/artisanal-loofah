var OnSite = require('../db/schemas/onsite');

module.exports = {
  get: function (user_id, sort, callback) {
    switch (sort) {
      case undefined:
      case 'created':
        OnSite.findAll({
          where: {
            user_id: user_id,
            $not: {status: 'Removed'}
          },
          order: [['createdAt', 'ASC']]
        })
        .then(function (onSites) {
          callback(onSites);
        });
        break;

      case 'date':
        OnSite.findAll({
          where: {
            user_id: user_id,
            $not: {
              status: ['Removed', 'Rejected']
            }
          },
          order: 'date_time ASC, status DESC'
        })
        .then(function (onSite) {
          callback(onSite);
        });
        break;

      case 'pending':
        OnSite.findAll({
          where: {
            user_id: user_id,
            status: 'Pending',
            $not: {
              status: ['Removed', 'Rejected']
            }
          },
          order: 'date_time ASC, status DESC'
        })
        .then(function (onSite) {
          callback(onSite);
        });
        break;    
    }
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
