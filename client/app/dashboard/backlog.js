angular.module('hunt.backlog', [])

.controller('BacklogController', function ($scope, $rootScope, $location, $window, Backlog) {

  $scope.backlogs = [];

  $scope.getBacklogs = function () {
    // Query the DB for all backlogs using the function in server controller 
    //  On success, assign $scope.backlogs to the data returned from query
    Backlog.getBacklogs($window.localStorage.getItem('user_id'))
      .then(function (data) {
        $scope.backlogs = data;
      })
      .catch(function (error) {
        console.log('Error initializing backlogs: ', error);
      });
  };

  $scope.removeBacklog = function () {

  };

  $scope.moveToAppSubmitted = function () {

  };

  $scope.load = function (backlog) {
    console.log('Clicked on: ', backlog)
    $rootScope.backlogID = backlog.id;
  };

  // Function for submitting any updated changes to a specific backlog
  $scope.submitChanges = function () {

    var backlogChanges = {
      id: $rootScope.backlogID,
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
  $scope.getBacklogs();
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
  };
});