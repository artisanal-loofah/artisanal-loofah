angular.module('hunt.appSubmit', ['hunt.backlog'])

.controller('AppSubmitController', function ($scope, $rootScope, $window, AppSubmit) {
  $rootScope.appSubmits = [];
  $rootScope.selectedAppSubmitIndex;

  $scope.getAppSubmits = function () {
    AppSubmit.getAppSubmits($window.localStorage.getItem('user_id'))
    .then(function (data) {
      $rootScope.appSubmits = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.removeAppSubmit = function () {

  };

  $scope.moveToPhoneScreen = function () {

  };

  // Function that sets the appSubmitID when user clicks on appSubmit
  $scope.clickedAppSubmit = function (appSubmit, index) {
    $rootScope.appSubmitID = appSubmit.id;
    $rootScope.selectedAppSubmitIndex = index;
  };

  // Function for submitting any updated changes to a specific appSubmit
  $scope.submitChanges = function () {

    var appSubmitChanges = {
      id: $rootScope.appSubmitID,
      notes: $scope.appSubmitNotes,
      status: $scope.appSubmitStatus
    };

    AppSubmit.editAppSubmit(appSubmitChanges)
      .then(function (appSubmit) {
        $rootScope.appSubmits.splice($rootScope.selectedAppSubmitIndex, 1, appSubmit);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to appSubmit: ", error);
      });
  };

  $scope.getAppSubmits();
})

.factory('AppSubmit', function ($http) {

  var getAppSubmits = function (userId) {
    return $http({
      method: 'GET',
      url: '/api/appsubmits',
      params: {
        userId: userId
      }
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var addAppSubmit = function (appSubmit) {
    return $http({
      method: 'POST',
      url: 'api/appsubmits',
      data: appSubmit
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  var editAppSubmit = function (appSubmit) {
    return $http({
      method: 'PUT',
      url: 'api/appsubmits',
      data: appSubmit
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  return {
    getAppSubmits: getAppSubmits,
    addAppSubmit: addAppSubmit,
    editAppSubmit: editAppSubmit
  };
});
