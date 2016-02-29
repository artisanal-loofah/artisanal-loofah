angular.module('hunt.backlog', [])

.controller('BacklogController', function ($scope, $rootScope, $location, $window, Backlog, AppSubmit, Helpers) {
  $rootScope.backlogs = [];
  $rootScope.selectedBacklog;
  $rootScope.selectedBacklogIndex;
  $scope.sort = 'created';
  $scope.accepted = false;

  // Function that retrieves all backlogs for given user
  $scope.getBacklogs = function (sort) {
    // user id is added on the backend
    Backlog.getBacklogs(sort)
      .then(function (data) {
        $rootScope.backlogs = data;
        console.log('data is :', data);
      })
      .catch(function (error) {
        console.log('Error getting backlogs: ', error);
      });
  };

  // Function that removes backlog
  $scope.removeBacklog = function (backlog, index) {
    if (window.confirm("Are you sure you want to remove this item from this stage?")){
      backlog.status = 'Removed';
      $rootScope.backlogs.splice(index, 1);
      Backlog.editBacklog(backlog)
      .catch(function (error) {
        console.log("Error editing backlog: ", error);
      });
    }
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
    // user id is added on the backend
    var newAppSubmit = {
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
    var selectedBacklog = $rootScope.selectedBacklog;
    Backlog.editBacklog(selectedBacklog)
      .then(function (backlog) {
        $rootScope.backlogs.splice($rootScope.selectedBacklogIndex, 1, backlog);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to backlog: ", error);
      });

    // Only send to next stage if a list item with the same application id doesn't already exist in next stage
    if (selectedBacklog.status === "Accepted" && Helpers.isNotDuplicate($rootScope.appSubmits, selectedBacklog.application_id)) {
      $scope.moveToAppSubmitted();
    } 
  };

  

  $scope.getBacklogs();
})

.factory('Backlog', function ($http) {

  // Retrieves all backlogs stored in database matching the passed in user id
  var getBacklogs = function (sort) {
    return $http({
      method: 'GET',
      url: '/api/backlogs',
      params: {
        sort: sort
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
