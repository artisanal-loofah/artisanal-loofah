var Application = require('../models/application');
var Company = require('../models/company');


module.exports = {
  createApp: function(req, res) {
    console.log(req.body.company);
    var companyName = req.body.company;
    var applicationData = {
      user_id: req.body.userId,
      job_title: req.body.jobTitle
    };

    Company.get(companyName, function(company) {
      if (!company) {
        var newCompany = {
          name: companyName,
        };

        Company.post(newCompany, function(companyId) {
          applicationData.company_id = companyId;

          Application.post(applicationData, function(application) {
            res.statusCode = 201;
            res.json(application);
          });

        });
      } else {
        applicationData.company_id = company.id;
        Application.post(applicationData, function(application) {
          res.statusCode = 201;
          res.json(application);
        });


      }
    });


    console.log(req.body)

  },
  post: function(req, res) {
    var userData = req.body;
    console.log(req.body);
    res.send({ data: 'hi' });

  }
};


// userId: 1, jobTitle: 'SW', company: 'Twitter'
