angular.module('hunt.backlog', [])

.controller('BacklogController', function ($scope, $location, Backlog, Application) {

  $scope.backlogs = Application.backlogs.data;

  //********************===============CHOUOUTSIDE===========********************************************************
  /*
  Removed initializeBacklog because backlog data must initialize in the Application Factory, so when there is a new Application created from the Application controller the new application can be inserted into the backlog data array in the factory which has a reference from $scope.backlogs in Backlog controller
  */
  
  // var initializeBacklogs = function () {
  //   // Query the DB for all backlogs using the function in server controller 
  //   //  On success, assign $scope.backlogs to the data returned from query
  //   Backlog.getBacklogs()
  //     .then(function (data) {
  //       $scope.backlogs = data;
  //     })
  //     .catch(function (error) {
  //       console.log('Error initializing backlogs: ', error);
  //     });
  // };

  $scope.addBacklog = function () {
    var newBacklog = {
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
      .then(function () {
        console.log('Backlog changes submitted!');
        $location.path('/main');
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to backlog.", error);
      });
  };

  // initializeBacklogs();
});
