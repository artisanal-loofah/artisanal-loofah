angular.module('hunt.phoneScreen', ['hunt.appSubmit'])

.controller('PhoneScreenController', function ($scope, $rootScope, $window, PhoneScreen, OnSite, Helpers) {
  $rootScope.phoneScreens = [];
  $rootScope.selectedPhoneScreen;
  $rootScope.selectedPhoneScreenIndex;
  $scope.sort = 'created'

  $scope.getPhoneScreens = function (sort) {
    // user id is added on the backend
    PhoneScreen.getPhoneScreens(sort)
  };

  $scope.set_color = function (phoneScreen) {
    if (phoneScreen.status === "Accepted") {
      return { 'background-color': "#DFF0D8" ,
                'border-style': 'solid', 
                'border-width': '5px',
                'border-color': '#CFCFC4',
                'border-radius': '5px',
                'padding': '0px 5px'
              }
    }
    if (phoneScreen.status === "Rejected") {
      return { 'background-color': "#F2DEDE",
                'border-style': 'solid',
                'border-width': '5px',
                'border-color': '#CFCFC4',
                'border-radius': '5px',
                'padding': '0px 5px'
              }
    }
    if (phoneScreen.status === "Pending") {
      return { 'background-color': "#DADFE1",
                'border-style': 'solid',
                'border-width': '5px',
                'border-color': '#CFCFC4',
                'border-radius': '5px',
                'padding': '0px 5px'
              }
    }
  };



  $scope.getPhoneScreens = function () {
    PhoneScreen.getPhoneScreens($window.localStorage.getItem('user_id'))
    .then(function (data) {
      $rootScope.phoneScreens = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.removePhoneScreen = function (phoneScreen, index) {
    if (window.confirm("Are you sure you want to remove this item from this stage?")){
      phoneScreen.status = 'Removed';
      $rootScope.phoneScreens.splice(index, 1);
      PhoneScreen.editPhoneScreen(phoneScreen)
      .catch(function (error) {
        console.log("Error editing phone screen: ", error);
      });
    }
  };

  $scope.moveToOnSite = function () {
    // user id is added on the backend
    var newOnSite = {
      application_id: $rootScope.selectedPhoneScreen.application_id,
      status: 'Pending'
    }

    OnSite.addOnSite(newOnSite)
      .then(function (onSite) {
        $rootScope.onSites.push(onSite);
      })
      .catch(function (error) {
        console.log("Error creating OnSite list item on phoneScreen status change: ", error);
      });
  };

  // Function that sets the phoneScreenID when user clicks on phoneScreen
  $scope.clickedPhoneScreen = function (phoneScreen, index) {
    $rootScope.selectedPhoneScreen = phoneScreen;
    // convert string (if it exists) to Date object
    if ($rootScope.selectedPhoneScreen.date_time) {
      $rootScope.selectedPhoneScreen.date_time = new Date($rootScope.selectedPhoneScreen.date_time);
    }
    $rootScope.selectedPhoneScreenIndex = index;
  };

  // Function for submitting any updated changes to a specific phoneScreen
  $scope.submitChanges = function () {
    var selectedPhoneScreen = $rootScope.selectedPhoneScreen;
    PhoneScreen.editPhoneScreen(selectedPhoneScreen)
      .then(function (phoneScreen) {
        $rootScope.phoneScreens.splice($rootScope.selectedPhoneScreenIndex, 1, phoneScreen);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to phoneScreen: ", error);
      });

      if (selectedPhoneScreen.status === "Accepted" && Helpers.isNotDuplicate($rootScope.onSites, selectedPhoneScreen.application_id)) {
        $scope.moveToOnSite();
      }
  };

  $scope.getPhoneScreens();
})

.factory('PhoneScreen', function ($http) {

  var getPhoneScreens = function (sort) {
    return $http({
      method: 'GET',
      url: '/api/phonescreens',
      params: {
        sort: sort
      }
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var addPhoneScreen = function (phoneScreen) {
    return $http({
      method: 'POST',
      url: 'api/phoneScreens',
      data: phoneScreen
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  var editPhoneScreen = function (phoneScreen) {
    return $http({
      method: 'PUT',
      url: 'api/phoneScreens',
      data: phoneScreen
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  return {
    getPhoneScreens: getPhoneScreens,
    addPhoneScreen: addPhoneScreen,
    editPhoneScreen: editPhoneScreen
  };
});
