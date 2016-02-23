var Application = require('../models/applicationModel');
var Company = require('../models/companyModel');


module.exports = {
  getAll: function (req, res) {
    Application.get(req.query.userId, function (applications) {
      res.json(applications);
    });
  },

  create: function (req, res) {
    var companyName = req.body.company;
    var companyId;

    Company.getOrCreate(companyName, function(company) {
      Application.create({
        user_id: req.body.userId,
        job_title: jobTitle,
        company_id: company.id
      }, function(application) {
        res.statusCode = 201;
        res.json(application);
      });
    });
  }
};
