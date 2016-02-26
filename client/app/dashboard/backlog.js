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

  $scope.editBacklog = function (backlog) {
    Backlog.editBacklog(backlog)
        .then(function (backlog) {
          $rootScope.backlogs.splice($rootScope.selectedBacklogIndex, 1, backlog);
        })
        .catch(function (error) {
          console.log("Error editing backlog: ", error);
        });
  };

  // Function that moves backlog to application submitted state
  $scope.moveToAppSubmitted = function () {
    var backlogChanges = {
        user_id: $window.localStorage.getItem('user_id'),
        application_id: $rootScope.selectedApplicationId,
        id: $rootScope.backlogID,
        notes: $scope.backlogNotes,
        status: 'Pending'
      };

      AppSubmit.addAppSubmit(backlogChanges)
        .then(function (backlog) {
          $rootScope.appSubmits.push(backlog);
          $rootScope.backlogs.splice($rootScope.selectedBacklogIndex, 1, backlog);
          backlogChanges.status = $scope.backlogStatus;
          $scope.editBacklog(backlogChanges);
        })
        .catch(function (error) {
          console.log("Error creating AppSubmit list item on backlog status change! ", error);
        });
  };

  // Function that sets the backlogID when user clicks on backlog
  $scope.clickedBacklog = function (backlog, index) {
    $rootScope.selectedBacklog = backlog;
    $rootScope.selectedBacklogIndex = index;
    $rootScope.selectedApplicationId = backlog.application_id;
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

    // If user changes state of backlog to accepted, move backlog to next stage
    // Else, update the backlog with new changes
    if ($scope.backlogStatus === "Accepted") {
      $scope.moveToAppSubmitted();
    } else {
      var backlogChanges = {
        id: $rootScope.backlogID,
        notes: $scope.backlogNotes,
        status: $scope.backlogStatus
      };
      $scope.editBacklog(backlogChanges);
    }

  };

  $scope.getBacklogs();
})

.factory('Backlog', function ($http) {

  // Retrieves all backlogs stored in database matching the passed in user id
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

  // Adds a new list item to backlog
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

  // Edits an existing backlog list item
  var editBacklog = function (backlog) {
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
