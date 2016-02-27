var User = require('../models/user');
var jwt =require('jwt-simple')


module.exports = {
  get: function (req, res) {
    if (req.query.linkedInId) {
      var linkedin_id = req.query.linkedInId;
      User.get({'linkedin_id': linkedin_id}, function (user) {
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      });
    } else if (req.query.id) {
      User.get({'id': req.query.id}, function (user) {
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      });
    }
  },

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
          var token = jwt.encode(user, 'secret');
          res.statusCode = 201;
          res.json({token: token});
        })
      } else {
        next(new Error('User already exist!'));
        res.statusCode = 409;
        res.end();
      }
    });
  }
};
