var Application = require('../models/user');


module.exports = {
  get: function (req, res) {
    var linkedin_id = req.body.linkedin_id;

  },
  post: function (req, res) {
    var userData = req.body;
    console.log(req.body);
    res.send({data: 'hi'});

  }
};