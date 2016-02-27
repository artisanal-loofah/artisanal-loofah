var Offer = require('../db/schemas/offer.js');

module.exports = {
  get: function (user_id, callback) {
    Offer.findAll({ where: {user_id: user_id}})
      .then(function (offers) {
        callback(offers);
      });
  },
  update: function (newProps, callback) {
    Offer.find({ where: { id: newProps.id } })
      .then(function (offer) {
        if (offer) {
          offer.update(newProps)
            .then(function (offer) {
              console.log('offer update function ran in offer models, successfully updated offer!');
              callback(offer);
            });
        }
      })
      .catch(function (error) {
        console.error('Error from update:', error);
      });
  }
};