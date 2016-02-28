var expect = require('chai').expect;
var request = require('request');

// This db will need to be created in postgres before you can run tests
var connectionString = 'postgres://localhost:5432/huntTest';
var Sequelize = require('sequelize');
var dbConnection = new Sequelize(connectionString);

// Load schemas & relations
var relations = require('../../server/db/relations');
var userSchema = relations.User;

// User model and controller, fetched after schema relations established
var userModel = require('../../server/models/user');
var userController = require('../../server/controllers/userController');


describe('User Controller', function() {

  before(function(done) {
    var users = [
    {
      first_name: 'Akshay',
      last_name: 'Buddiga',
      headline: 'Guard at Chicago Bulls',
      linkedin_id: 'gr4-Hr3-Mcw',
      picture_url: 'myPicture.jpg'
    },
    {
      first_name: 'Alex',
      last_name: 'Chou',
      headline: 'Performer at Dancing with the Stars',
      linkedin_id: 'le6-ds1-BJ9',
      picture_url: 'myPicture2.jpg'
    }];
    users.forEach(function(user, index) {
      userSchema.create(user)
      .then(function() {
        if (index === users.length - 1) {
          done();
        }
      });
    });
  });

  it('GET request should return a user object and token', function(done) {
    request({ method: 'GET',
              uri: 'http://localhost:3000/api/users',
              params: {
                linkedInId: 'gr4-Hr3-Mcw'
              }
    }, function(err, res, body) {
      console.log('err: ', err);
      console.log('res status code: ', res.statusCode);
      expect(res.data.token).to.be.a('string');
      expect(res.data.user.first_name).to.equal('Akshay');
      done();
    });
  });
});
