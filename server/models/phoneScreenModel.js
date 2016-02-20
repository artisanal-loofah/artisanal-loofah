var PhoneScreen = require('../db/schemas/phonescreen');

module.exports = {

  createNew: function (data, callback) {
    PhoneScreen.create(data).then(function (phoneScreen) {
      callback(phoneScreen.get('id'))
    })
  },

  modify: function (data, callback) {
    PhoneScreen.findOne({ where: {application_id: data.application_id}})
    .on('success', function (phoneScreen) {
      if (phoneScreen) {
        phoneScreen.update(data)
        .success(function () {
          console.log("phoneScreen successfully updated");
          callback();
        });
      }
    })
  },

  getAllPhoneScreens: function (callback) {
    PhoneScreen.findAll({}).then(function (phoneScreens) {
      callback(phoneScreens);
    });
  },

  getOne: function (data, callback) {
    PhoneScreen.findOne({ where: {application_id: data.application_id}})
    .on('success', function (phoneScreen) {
      callback(phoneScreen);
    }) 
  }

};