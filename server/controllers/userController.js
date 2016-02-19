var User = require('../models/user');


module.exports = {
	get: function (req, res) {
		var linkedin_id = req.body.linkedin_id;
		User.get(linkedin_id, function (user) {
			res.json(user);
		});
	},
	post: function (req, res) {
    var userData = req.body;

    console.log('userdata: ', userData);

    User.get(userData.id, function (user) {

      if (user.length === 0) {

        var newUser = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          linkedin_id: userData.id,
          picture_url: userData.pictureUrl
        };

        var username = newUser.firstName + ' ' + newUser.lastName
        
        console.log('i should already exist but im getting called wtf man')

        User.post(username, function () {
          console.log('username be lookin like: ', username);
          res.statusCode = 201;
          res.end();
        })
      } else {
        console.log('okay its actually stored somewhere')
        res.statusCode = 404;
        res.end();
      }
    });

    // res.statusCode =201;
    // res.end();

  //   User.get(req.body.linkedin_id, function (user) {
  //     if (user.length === 0) {


  //       // var newUser = {
  //       //   firstName: req.body.firstName,
  //       //   lastName: req.body.lastName,
  //       //   linkedin_id: req.body.linkedin_id,
  //       //   picture_url: req.body.picture_url
  //       // };

		// 		// User.post(username, function() {
		// 		// 	res.statusCode = 201;
		// 		// 	res.end(); 
		// 		// });
		// 	} else {
		// 		res.statusCode = 409;
		// 		res.end();
		// 	}
		// });	
	}
};