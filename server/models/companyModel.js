var Company = require('../db/schemas/company');


module.exports = {
  getOrCreate: function (companyName, callback) {
    Company.findOne({ where: {name: companyName}})
    .then(function(company) {
      if (company) {
        callback(company);
      } else {
        Company.create({name: companyName})
        .then(function(company) {
          callback(company);
        });
      }
    });
  }
};
