angular.module('hunt.backlog', [])

.controller('BacklogController', function ($scope, $rootScope, $location, Backlog) {

  $scope.backlog = {};
  $scope.backlogs = [];

  var initializeBacklogs = function () {
    console.log('rootscope is : ', $rootScope);
    // Query the DB for all backlogs using the function in server controller 
    //  On success, assign $scope.backlogs to the data returned from query
    Backlog.getBacklogs($rootScope.user.id)
      .then(function (data) {
        $scope.backlogs = data;
      })
      .catch(function (error) {
        console.log('Error initializing backlogs: ', error);
      });
  };

  $scope.addBacklog = function () {
    var newBacklog = {
      userId: $rootScope.user.id,
      notes: $scope.backlogNotes,
      status: $scope.backlogStatus
    };

    Backlog.addBacklog(newBacklog)
      .then(function () {
        console.log('Backlog changes submitted!');
        $location.path('/main');
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to backlog.", error);
      });
  };

  $scope.removeBacklog = function () {

  };

  $scope.moveToAppSubmitted = function () {

  };

  // Function for submitting any updated changes to a specific backlog
  $scope.submitChanges = function () {

    var backlogChanges = {
      notes: $scope.backlogNotes,
      status: $scope.backlogStatus
    };

    Backlog.submitBacklogChanges(backlogChanges)
      .then(function (backlog) {
        console.log('Backlog changes submitted!');
        // do something with appsubmit using backlog.application_id
        $location.path('/main');
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to backlog.", error);
      });
  };

  initializeBacklogs();
})

.factory('Backlog', function ($http) {

  // Retrieves all backlogs stored in database
  var getBacklogs = function (userId) {
    return $http({
      method: 'GET',
      url: '/api/backlogs',
      params: {
        userId: userId
      }
    })
    .then(function (resp) {
      console.log('GET request to /api/backlogs/ successful! The response is: ', resp.data);
      return resp.data;
    });
  };

  var submitBacklogChanges = function (backlog) {
    console.log('clientside backlog: ', backlog);
    return $http({
      method: 'PUT',
      url: '/api/backlogs',
      data: backlog
    })
    .then(function (resp) {
      console.log('PUT request to /api/backlogs successful! The response is: ', resp);
      return resp.data;
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