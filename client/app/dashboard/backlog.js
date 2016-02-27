angular.module('hunt.backlog', [])

.controller('BacklogController', function ($scope, $rootScope, $location, $window, Backlog, AppSubmit) {
  $rootScope.backlogs = [];
  $rootScope.selectedBacklog;
  $rootScope.selectedBacklogIndex;
  $scope.accepted = false;

  // Function that retrieves all backlogs for given user
  $scope.getBacklogs = function () {
    Backlog.getBacklogs($window.localStorage.getItem('user_id'))
      .then(function (data) {
        $rootScope.backlogs = data;
        console.log('data is :', data);
      })
      .catch(function (error) {
        console.log('Error getting backlogs: ', error);
      });
  };

  // Function that removes backlog
  $scope.removeBacklog = function () {

  };

  // Function that edits an existing backlog
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
    var newAppSubmit = {
      user_id: $rootScope.selectedBacklog.user_id,
      application_id: $rootScope.selectedBacklog.application_id,
      status: 'Pending' 
    }

    AppSubmit.addAppSubmit(newAppSubmit)
      .then(function (appSubmit) {
        $rootScope.appSubmits.push(appSubmit);
      })
      .catch(function (error) {
        console.log("Error creating AppSubmit list item on backlog status change: ", error);
      });
  };

  // Function that sets the selectedBacklog to backlog user clicked on
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

    if ($rootScope.selectedBacklog.status === "Accepted") {
      $scope.moveToAppSubmitted();
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
