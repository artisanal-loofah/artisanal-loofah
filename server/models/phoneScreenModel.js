var PhoneScreen = require('../db/schemas/phonescreen');

module.exports = {

  createNew: function (data, callback) {
    PhoneScreen.create(data).then(function (phoneScreen) {
      callback(phoneScreen.get('id'))
    })
  },

  getAllPhoneScreens: function (callback) {
    PhoneScreen.findAll({}).then(function (phoneScreens) {
      callback(phoneScreens);
    });
  },

  modify: function (data, callback) {
    PhoneScreen.find({ where: {application_id: data.application_id}})
    .on('success', function (phoneScreen) {
      if (phoneScreen) {
        phoneScreen.updateAttributes({
          notes: data.notes,
          status: data.status,
          date_time: data.date_time,
          interviewer: data.interviewer
        }).success(function () {
          console.log("phoneScreen successfully updated");
        });
      }
    })
  }
};