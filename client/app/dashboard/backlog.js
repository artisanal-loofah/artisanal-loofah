angular.module('hunt.backlog', [])

.controller('BacklogController', function ($scope, $rootScope, $location, $window, Backlog) {

  $rootScope.backlogs = [];
  $rootScope.selectedBacklogIndex;

  $scope.getBacklogs = function () {
    // Query the DB for all backlogs using the function in server controller 
    //  On success, assign $scope.backlogs to the data returned from query
    Backlog.getBacklogs($window.localStorage.getItem('user_id'))
      .then(function (data) {
        $rootScope.backlogs = data;
      })
      .catch(function (error) {
        console.log('Error initializing backlogs: ', error);
      });
  };

  $scope.removeBacklog = function () {

  };

  $scope.moveToAppSubmitted = function () {

  };

  // Function that sets the backlogID when user clicks on backlog
  $scope.clickedBacklog = function (backlog, index) {
    $rootScope.backlogID = backlog.id;
    $rootScope.selectedBacklogIndex = index;
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
        $rootScope.backlogs.splice($rootScope.selectedBacklogIndex, 1, backlog);
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
      return resp.data;
    });
  };

  return {
    getBacklogs: getBacklogs,
    submitBacklogChanges: submitBacklogChanges,
    addBacklog: addBacklog
  };
});