var expect = require('chai').expect;

// This db will need to be created in postgres before you can run tests
var connectionString = 'postgres://localhost:5432/hunttest';
var Sequelize = require('sequelize');
var dbConnection = new Sequelize(connectionString);

// Load schemas & relations
var relations = require('../../server/db/relations');
var userSchema = relations.User;

// User model, fetched after schema relations established
var userModel = require('../../server/models/user');


describe('User Model', function() {

  before(function(done) {
    // create some users
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
    },
    {
      first_name: 'Albert',
      last_name: 'Huynh',
      headline: 'CEO at WheelChimp',
      linkedin_id: '9kM-We4-qa2',
      picture_url: 'myPicture3.jpg'
    },
    {
      first_name: 'Gar',
      last_name: 'Lee',
      headline: 'General Manager at Seattle Seahawks',
      linkedin_id: 'lB3-Yt9-p2p',
      picture_url: 'myPicture4.jpg'
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

  it('should get a user by LinkedIn id', function(done) {
    userModel.get({linkedin_id: 'gr4-Hr3-Mcw'}, function(user) {
      expect(user.first_name).to.equal('Akshay');
      done();
    });
  });

  it('should create a new user', function(done) {
    var newUser = {
      first_name: 'Stephen',
      last_name: 'Curry',
      headline: 'Point Guard at Golden State Warriors',
      linkedin_id: 'p1A-6U2-fd4',
      picture_url: 'myPicture5.jpg'
    };
    userModel.post(newUser, function(user) {
      userModel.get({linkedin_id: 'p1A-6U2-fd4'}, function(user) {
        expect(user.first_name).to.equal('Stephen');
        done();
      });
    });
  });
});
