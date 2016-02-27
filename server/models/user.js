var User = require('../db/schemas/user');


module.exports = {
  get: function (query, callback) {
    User.findOne({ where: query})
    .then(function(user) {
      callback(user);
    })
    .catch(function(error) {
      console.error(error);
      callback();
    });
  },
  post: function (user, callback) {
    User.create(user)
    .then(function(user){
      callback(user);
    })
    .catch(function(error) {
      console.error(error);
      callback();
    });
  }
};
