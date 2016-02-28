var Application = require('../models/applicationModel');
var Company = require('../models/companyModel');


module.exports = {
  addApplication: function (req, res) {
    var companyName = req.body.company;
    var companyId;

    Company.getOrCreate(companyName, function(company) {
      Application.create({
        user_id: req.user.id,
        job_title: req.body.jobTitle,
        company_id: company.id
      }, function(application) {
        res.statusCode = 201;
        res.json(application);
      });
    });
  }
};
