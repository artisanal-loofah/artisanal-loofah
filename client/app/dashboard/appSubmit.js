angular.module('hunt.appSubmit', ['hunt.backlog'])

.controller('AppSubmitController', function ($scope, $rootScope, $window, AppSubmit, PhoneScreen, Helpers) {
  // Track list items on the rootScope so they are accessible
  // in other list item controllers
  $rootScope.appSubmits = [];
  $rootScope.selectedAppSubmit;
  $rootScope.selectedAppSubmitIndex;
  $scope.sort = 'created';

  // Get all backlogs for given user, called when page loads
  $scope.getAppSubmits = function (sort) {
    // user id is added on the backend
    AppSubmit.getAppSubmits(sort)
    .then(function (data) {
      $rootScope.appSubmits = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.removeAppSubmit = function (appSubmit, index) {
    if (window.confirm("Are you sure you want to remove this item from this stage?")){
      appSubmit.status = 'Removed';
      $rootScope.appSubmits.splice(index, 1);
      AppSubmit.editAppSubmit(appSubmit)
      .catch(function (error) {
        console.log("Error editing App Submit: ", error);
      });
    }
  };

  // Create new phoneScreen on status==="Accepted"
  $scope.moveToPhoneScreen = function () {
    // user id is added on the backend
    var newPhoneScreen = {
      application_id: $rootScope.selectedAppSubmit.application_id,
      status: 'Pending',
      interviewer: $scope.newPhoneScreenInterviewer,
      date_time: $scope.newPhoneScreenDate_time,
      notes: $scope.newPhoneScreenNotes
    };

    PhoneScreen.addPhoneScreen(newPhoneScreen)
      .then(function (phoneScreen) {
        $rootScope.phoneScreens.push(phoneScreen);
      })
      .catch(function (error) {
        console.log("Error creating PhoneScreen list item on AppSubmit status change : ", error);
      });

    $scope.newPhoneScreenInterviewer = null;
    $scope.newPhoneScreenDate_time = null;
    $scope.newPhoneScreenNotes = null;
  };

  // Assigns rootScope variables to clicked appSubmit, so they can be
  // used elsewhere
  $scope.clickedAppSubmit = function (appSubmit, index) {
    $rootScope.selectedAppSubmit = appSubmit;
    $rootScope.selectedAppSubmitIndex = index;
  };

  // Submit changes on edit, move to next stage if status==='Accepted'
  $scope.submitChanges = function () {
    var selectedAppSubmit = $rootScope.selectedAppSubmit;
    AppSubmit.editAppSubmit(selectedAppSubmit)
      .then(function (appSubmit) {
        $rootScope.appSubmits.splice($rootScope.selectedAppSubmitIndex, 1, appSubmit);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to appSubmit: ", error);
      });

      if (selectedAppSubmit.status === "Accepted" && Helpers.isNotDuplicate($rootScope.phoneScreens, selectedAppSubmit.application_id)) {
        $scope.moveToPhoneScreen();
      }
  };

  $scope.getAppSubmits();
})

.factory('AppSubmit', function ($http) {

  var getAppSubmits = function (sort) {
    return $http({
      method: 'GET',
      url: '/api/appsubmits',
      params: {
        sort: sort
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
