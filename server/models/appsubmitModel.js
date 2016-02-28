var AppSubmit = require('../db/schemas/appsubmit');

module.exports = {
  get: function (user_id, sort, callback) {
    switch(sort) {
      case undefined:
      case 'created':
        AppSubmit.findAll({ 
          where: {
            user_id: user_id,
            $not: {status: 'Removed'}
          },
          order: [['createdAt', 'ASC']]
        })
        .then(function (appSubmits) {
          callback(appSubmits);
        });
        break;

      case 'pending':
        AppSubmit.findAll({
          where: {
            user_id: user_id,
            status: 'Pending',
            $not: {
              status: ['Removed', 'Rejected']
            }
          },
          order: 'status DESC'
        })
        .then(function (appSubmits) {
          callback(appSubmits);
        });
        break;
    }
  },

  create: function (appSubmit, callback) {
    AppSubmit.create(appSubmit)
      .then(function (appSubmit) {
        callback(appSubmit)
      });
  },

  update: function (newProps, callback) {
    AppSubmit.find({ where: {id: newProps.id}})
    .then(function (appSubmit) {
      if (appSubmit) {
        appSubmit.update(newProps)
          .then(function (appSubmit) {
            console.log("appsubmit successfully updated");
            callback(appSubmit);
          });
      }
    })
    .catch(function(error) {
      console.error('Error from update: ', error);
    });
  }

};
