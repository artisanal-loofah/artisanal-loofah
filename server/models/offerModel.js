var Offer = require('../db/schemas/offer.js');

module.exports = {
  get: function (user_id, callback) {
    Offer.findAll({ where: {user_id: user_id}})
      .then(function (offers) {
        callback(offers);
      });
  }
};