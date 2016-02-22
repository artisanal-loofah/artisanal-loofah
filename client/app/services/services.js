angular.module('hunt.services', [])
.factory('Dashboard', function($http) {

})
.factory('Application', function($http) {
  var backlogs = {data: []};

  var addApplication = function(appData) {
    return $http({
        method: 'POST',
        url: '/api/application',
        data: appData
      })
      .then(function(resp) {
        console.log("this is the new backlog data", resp.data);
        backlogs.data.push(resp.data);
        console.log("this is the updated backlogs object", backlogs);
        return resp.data;
      });
  };

  var getBacklogs = function () {
    return $http({
      method: 'GET',
      // url: '/api/Backlogs'
      url: '/api/pendingBacklogs'
    })
    .then(function (resp) {
      backlogs.data = resp.data;
      console.log("this is the backlogs object initialized", backlogs);
    });
  };

  getBacklogs();

  return {
    addApplication: addApplication,
    backlogs: backlogs
  };
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
});

