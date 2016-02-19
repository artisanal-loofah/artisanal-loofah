var User = require('../models/user');


module.exports = {
  get: function (req, res) {
    var linkedin_id = req.query.id;
    User.get(linkedin_id, function (user) {
      res.json(user);
    });
  },

  post: function (req, res) {
    var userData = req.body;

    User.get(userData.id, function (user) {
      if (!user) {
        var newUser = {
          first_name: userData.firstName,
          last_name: userData.lastName,
          linkedin_id: userData.id,
          picture_url: userData.pictureUrl,
          headline: userData.headline
        };

        User.post(newUser, function (user) {
          res.statusCode = 201;
          res.json(user);
        })
      } else {
        res.statusCode = 409;
        res.end();
      }
    });
  }
};
