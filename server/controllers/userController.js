var User = require('../models/user');

module.exports = {
	get: function (req, res) {
		var linkedin_id = req.body.linkedin_id;
		User.get(linkedin_id, function (user) {
			res.json(user);
		});
	},
	post: function (req, res) {
    console.log('body--->', req.body);
    console.log('data--->', req.data);
    res.statusCode =201;
    res.end();

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