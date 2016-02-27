angular.module('hunt.backlog', [])

.controller('BacklogController', function ($scope, $rootScope, $location, $window, Backlog, AppSubmit) {
  $rootScope.backlogs = [];
  $rootScope.selectedBacklog;
  $rootScope.selectedBacklogIndex;

  // Function that retrieves all backlogs for given user
  $scope.getBacklogs = function () {
    Backlog.getBacklogs($window.localStorage.getItem('user_id'))
      .then(function (data) {
        $rootScope.backlogs = data;
      })
      .catch(function (error) {
        console.log('Error initializing backlogs: ', error);
      });
  };

  // Function that removes backlog
  $scope.removeBacklog = function () {

  };

  // Function that moves backlog to application submitted state
  $scope.moveToAppSubmitted = function () {

  };

  // Function that sets the backlogID when user clicks on backlog
  $scope.clickedBacklog = function (backlog, index) {
    $rootScope.selectedBacklog = backlog;
    $rootScope.selectedBacklogIndex = index;
  };

  // Function for submitting any updated changes to a specific backlog
  $scope.submitChanges = function () {
    Backlog.editBacklog($rootScope.selectedBacklog)
      .then(function (backlog) {
        $rootScope.backlogs.splice($rootScope.selectedBacklogIndex, 1, backlog);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to backlog: ", error);
      });

    var backlogChanges = {
      id: $rootScope.backlogID,
      notes: $scope.backlogNotes,
      status: $scope.backlogStatus
    };

    if ($scope.backlogStatus === "Accepted") {
      AppSubmit.addAppSubmit(backlogChanges)
        .then(function (backlog) {
          console.log("Added a new app submit from backlog after changing state! ", backlog);
          // Do something here after creating a new app submit list item
        })
        .catch(function (error) {
          console.log("Error creating a new AppSubmit list item in backlog submit changes! ", error);
        });
    } else {
      Backlog.editBacklog(backlogChanges)
        .then(function (backlog) {
          $rootScope.backlogs.splice($rootScope.selectedBacklogIndex, 1, backlog);
        })
        .catch(function (error) {
          console.log("There was an error submitting changes to backlog: ", error);
        });
      }
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
    .then(function (res) {
      return res.data;
    });
  };

  var addBacklog = function (backlog) {
    return $http({
      method: 'POST',
      url: '/api/backlogs',
      data: backlog
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  var editBacklog = function (backlog) {
    console.log('clientside backlog: ', backlog);
    return $http({
      method: 'PUT',
      url: '/api/backlogs',
      data: backlog
    })
    .then(function (res) {
      return res.data;
    });
  };

  return {
    getBacklogs: getBacklogs,
    addBacklog: addBacklog,
    editBacklog: editBacklog
  };
});
