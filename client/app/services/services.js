angular.module('hunt.services', [])
  .factory('Application', function($http) {
    var addApplication = function(appData) {
      console.log('in services');
      return $http({
          method: 'POST',
          url: '/api/application',
          data: appData
        })
        .then(function(resp) {
          return resp.data;
        });
    };

<<<<<<< 2993cad214ab1230b6ba38ddedf6d1467fe5884e
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
  };

  var submitBacklogChanges = function (backlog) {
    return $http({
      method: 'PUT',
      url: '/api/backlogs',
      data: backlog
    })
    .then(function (resp) {
      console.log('PUT request to /api/backlogs successful! The response is: ', resp);
      return resp;
    });
  };

  var addBacklog = function (backlog) {
    return $http({
      method: 'POST',
      url: '/api/backlogs',
      data: backlog
    })
    .then(function (resp) {
      console.log('POST request to /api/backlogs successful! The response is: ', resp);
      return resp;
    });
  };

  return {
    getBacklogs: getBacklogs,
    submitBacklogChanges: submitBacklogChanges,
    addBacklog: addBacklog
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
  };
})
.factory('Application', function($http){
  var addApplication = function(){
    console.log('in services');
  };

  return {
    addApplication: addApplication
  };
});
=======
    return {
      addApplication: addApplication
    };
  });
>>>>>>> add additional routes to routes.js and add applicationController to handle post request coming from the jobSearch bar
