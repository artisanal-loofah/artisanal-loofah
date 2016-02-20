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

    //Must checks the Company table to see if the company already exists
    Company.get(companyName, function(company) {
      //If company exists create a new entry in the Company table
      if (!company) {
        var newCompany = {
          name: companyName,
        };

        Company.post(newCompany, function(companyId) {
          //adding company_id property must be added to create an application, but is dependent on the Company query
          applicationData.company_id = companyId;

          Application.post(applicationData, function(application) {
            res.statusCode = 201;
            res.json(application);
          });
        });

      } else {
        //Company.get returns the row from the query which contains the ID that must be added onto the applicationData object
        //to create a new application in the databse
        applicationData.company_id = company.id;
        Application.post(applicationData, function(application) {
          res.statusCode = 201;
          res.json(application);
        });
      }
    });
  }
};

