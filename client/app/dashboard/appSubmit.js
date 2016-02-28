angular.module('hunt.appSubmit', ['hunt.backlog'])

.controller('AppSubmitController', function ($scope, $rootScope, $window, AppSubmit, PhoneScreen, Helpers) {
  $rootScope.appSubmits = [];
  $rootScope.selectedAppSubmit;
  $rootScope.selectedAppSubmitIndex;
  $scope.sort = 'created';

  $scope.getAppSubmits = function (sort) {
    // user id is added on the backend
    AppSubmit.getAppSubmits(sort)

  };  

  $scope.set_color = function (appSubmit) {
    if (appSubmit.status === "Accepted") {
      return { 'background-color': "#DFF0D8" ,
                'border-style': 'solid', 
                'border-width': '5px',
                'border-color': '#CFCFC4',
                'border-radius': '5px',
                'padding': '0px 5px'
              }
    }
    if (appSubmit.status === "Rejected") {
      return { 'background-color': "#F2DEDE",
                'border-style': 'solid',
                'border-width': '5px',
                'border-color': '#CFCFC4',
                'border-radius': '5px',
                'padding': '0px 5px'
              }
    }
    if (appSubmit.status === "Pending") {
      return { 'background-color': "#DADFE1",
                'border-style': 'solid',
                'border-width': '5px',
                'border-color': '#CFCFC4',
                'border-radius': '5px' ,
                'padding': '0px 5px'
              }
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

  $scope.moveToPhoneScreen = function () {
    // user id is added on the backend
    var newPhoneScreen = {
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
