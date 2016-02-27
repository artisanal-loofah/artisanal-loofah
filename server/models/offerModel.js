var Offer = require('../db/schemas/offer');


module.exports = {
  get: function (user_id, callback) {
    Offer.findAll({ where: {
      user_id: user_id,
      $not: {status: 'Removed'}
    }})
      .then(function (offers) {
        callback(offers);
      });
  },

  create: function (offer, callback) {
    Offer.create(offer)
      .then(function (offer) {
        callback(offer);
      });
  },

  update: function (newProps, callback) {
    Offer.find({ where: { id: newProps.id } })
      .then(function (offer) {
        if (offer) {
          offer.update(newProps)
            .then(function (offer) {
              console.log('Offer update function ran in Offer models, successfully updated Offer!');
              callback(offer);
            });
        }
      })
      .catch(function (error) {
        console.error('Error from update:', error);
      });
  }
  
};
