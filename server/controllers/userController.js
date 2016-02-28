var User = require('../models/user');
var jwt =require('jwt-simple')


module.exports = {
  // Responds with user and token
  get: function (req, res) {
    if (req.query.linkedInId) {
      var linkedin_id = req.query.linkedInId;
      User.get({'linkedin_id': linkedin_id}, function (user) {
        var token = jwt.encode(user, 'secret');
        var responseData = {
          user: user,
          token: token
        };
        res.json(responseData);
      });
    } else {
      res.statusCode = 401;
      res.send("Could not find that LinkedIn id.");
    }
  },
  
  // Responds with user and token
  post: function (req, res, next) {
    var userData = req.body;

    User.get({'linkedin_id': userData.id}, function (user) {
      if (!user) {
        var newUser = {
          first_name: userData.firstName,
          last_name: userData.lastName,
          linkedin_id: userData.id,
          picture_url: userData.pictureUrl,
          headline: userData.headline
        };

        User.post(newUser, function (user) {
          var responseData = {
            user: user,
            token: token
          };
          res.statusCode = 201;
          res.json(responseData);
        })
      } else {
        next(new Error('User already exists!'));
        res.statusCode = 409;
        res.end();
      }
    });
  }
};
