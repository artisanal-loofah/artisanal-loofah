angular.module('hunt.services', [])

.factory('Dashboard', function($http) {

})

.factory('Backlog', function ($http) {

  // Retrieves all backlogs stored in database
  var getBacklogs = function () {
    return $http({
      method: 'GET',
      url: '/api/backlogs'
    })
    .then(function (resp) {
      console.log('GET request to /api/backlogs/ successful! The response is: ', resp.data);
      return resp.data;
    });
  }

  var submitBacklogChanges = function (backlog) {
    return $http({
      method: 'POST',
      url: '/api/backlogs',
      data: backlog
    })
    .then(function (resp) {
      console.log('POST request to /api/backlogs successful! The response is: ', resp);
      return resp;
    });
  }

  return {
    getBacklogs: getBacklogs,
    submitBacklogChanges: submitBacklogChanges
  }
})

.factory('User', function($http) {
  var getUser = function(id) {
    return $http({
      method: 'GET',
      url: '/api/users',
      params: {
        id: id
      }
    }).then(function(res) {
      return res;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var createUser = function(userData) {
    return $http({
      method: 'POST',
      url: '/api/users',
      data: userData
    }).then(function(res) {
      return res;
    }).catch(function (error) {
      console.error(error);
    });
  };

  return {
    getUser: getUser,
    createUser: createUser
  }
});
