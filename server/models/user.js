var User = require('../db/schemas/user');


module.exports = {
  get: function (linkedin_id, callback) {
    User.findOne({ where: {linkedin_id: linkedin_id}})
    .then(function(user) {
      callback(user);
    });
  },
  post: function (user, callback) {
    User.create(user).then(function(user){
      callback(user);
    });
  }
};
