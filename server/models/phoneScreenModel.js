var PhoneScreen = require('../db/schemas/phonescreen');

module.exports = {
  get: function (user_id, callback) {
    PhoneScreen.findAll({ where: {
      user_id: user_id,
      $not: {status: 'Removed'}
    }})
      .then(function (phoneScreens) {
        callback(phoneScreens);
      });
  },

  create: function (phoneScreen, callback) {
    PhoneScreen.create(phoneScreen)
      .then(function (phoneScreen) {
        callback(phoneScreen);
      });
  },

  update: function (newProps, callback) {
    // Currently, update function is searching for a matching 'notes' value,
    //  We need to make it search for a matching application_id 
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