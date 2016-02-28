var PhoneScreen = require('../db/schemas/phonescreen');

module.exports = {
  get: function (user_id, callback, sort) {
    switch(sort) {
      case undefined:
      case 'created':
        PhoneScreen.findAll({where: {
          user_id: user_id,
          $not: {status: 'Removed'}
        }})
        .then(function (phoneScreens) {
          callback(phoneScreens);
        });
        break;

      case 'date':
        PhoneScreen.findAll({
          where: {
            user_id: user_id,
            $not: {
              status: ['Removed', 'Rejected']
            }
          },
          order: 'date_time ASC, status DESC'
        })
        .then(function (phoneScreens) {
          callback(phoneScreens);
        });
        break;

      case 'pending':
        PhoneScreen.findAll({
          where: {
            user_id: user_id,
            status: 'Pending',
            $not: {
              status: ['Removed', 'Rejected']
            }
          },
          order: 'date_time ASC, status DESC'
        })
        .then(function (phoneScreens) {
          callback(phoneScreens);
        });
        break;
      
    }
  },

  create: function (phoneScreen, callback) {
    PhoneScreen.create(phoneScreen)
      .then(function (phoneScreen) {
        callback(phoneScreen);
      });
  },

  update: function (newProps, callback) {
    PhoneScreen.find({ where: { id: newProps.id } })
      .then(function (phoneScreen) {
        if (phoneScreen) {
          phoneScreen.update(newProps)
            .then(function (phoneScreen) {
              console.log('phoneScreen update function ran in phoneScreen models, successfully updated phoneScreen!');
              callback(phoneScreen);
            });
        }
      })
      .catch(function (error) {
        console.error('Error from update:', error);
      });
  }

};
