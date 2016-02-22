angular.module('hunt.services', [])
.factory('Dashboard', function($http) {

})
.factory('Application', function($http) {
/*backlogs CURRENTLY stores all the backlogs in the database, it MUST be tailored to the user though, and only display 
  backlogs that are specific to the user and that are pending or not submitted. The sql query that does this is located in
  Server/models/backlog.js in the getPending method.  There are 3 methods. The first method gets ALL backlogs, including
  other users, the second method gets only the backlogs specific to a designated user but still grabs the completed
  or null values.
*/  
  var backlogs = {data: []};

  var getBacklogs = function () {
    return $http({
      method: 'GET',
      /*FOllOW this trail!!!!!!!!!!!!!!!!!!!!! go to routes.js in the server folder */
      url: '/api/pendingBacklogs'
    })
    .then(function (resp) {
      backlogs.data = resp.data;
      console.log("this is the backlogs object initialized", backlogs);
    });
  };

  /*Add Application is the reason why we need to have the backlogs variable inside the Application Factory
    instead of the backlog controller, every time an application is added the Company, Application, and Backlog
    Tables are being modified. 


  */
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

