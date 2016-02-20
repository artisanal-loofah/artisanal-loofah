var Company = require('../db/schemas/company');

module.exports = {
  get: function (company_name, callback) {
    Company.findOne({ where: {name: company_name}})
    .then(function(company) {
      callback(company);
    });
  },
  post: function (company_data, callback) {
    Company.create(company_data).then(function(company){
      callback(company.get('id'));
    });
  }
};
