angular.module('hunt.appSubmit', ['hunt.backlog'])

.controller('AppSubmitController', function ($scope, $rootScope, $window, AppSubmit, PhoneScreen) {
  $rootScope.appSubmits = [];
  $rootScope.selectedAppSubmit;
  $rootScope.selectedAppSubmitIndex;

  $scope.set_color = function (appSubmit) {
    if (appSubmit.status === "Accepted") {
      return { 'background-color': "#7CFC00" ,
                'border-style': 'solid', 
                'border-width': '5px',
                'border-color': '#4C924C'}
    }
    if (appSubmit.status === "Rejected") {
      return { 'background-color': "#FF3232",
                'border-style': 'solid',
                'border-width': '5px',
                'border-color': '#990000'}
    }
    if (appSubmit.status === "Pending") {
      return { 'background-color': "#D3D3D3",
                'border-style': 'solid',
                'border-width': '5px',
                'border-color': '#A8A8A8' }
    }
  };



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
    var newPhoneScreen = {
      user_id: $rootScope.selectedAppSubmit.user_id,
      application_id: $rootScope.selectedAppSubmit.application_id,
      status: 'Pending'
    }

    PhoneScreen.addPhoneScreen(newPhoneScreen)
      .then(function (phoneScreen) {
        $rootScope.phoneScreens.push(phoneScreen);
      })
      .catch(function (error) {
        console.log("Error creating PhoneScreen list item on AppSubmit status change : ", error);
      });
  };

  // Function that sets the appSubmitID when user clicks on appSubmit
  $scope.clickedAppSubmit = function (appSubmit, index) {
    $rootScope.selectedAppSubmit = appSubmit;
    $rootScope.selectedAppSubmitIndex = index;
  };

  // Function for submitting any updated changes to a specific appSubmit
  $scope.submitChanges = function () {
    AppSubmit.editAppSubmit($rootScope.selectedAppSubmit)
      .then(function (appSubmit) {
        $rootScope.appSubmits.splice($rootScope.selectedAppSubmitIndex, 1, appSubmit);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to appSubmit: ", error);
      });

      if ($rootScope.selectedAppSubmit.status === "Accepted") {
        $scope.moveToPhoneScreen();
      }
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
