angular.module('hunt.phoneScreen', ['hunt.appSubmit'])

.controller('PhoneScreenController', function ($scope, $rootScope, $window, PhoneScreen, OnSite) {
  $rootScope.phoneScreens = [];
  $rootScope.selectedPhoneScreen;
  $rootScope.selectedPhoneScreenIndex;

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
      $scope.clickedPhoneScreen(phoneScreen, index);
      phoneScreen.status = 'Removed';
      $rootScope.phoneScreens.splice(index, 1);
      PhoneScreen.editPhoneScreen(phoneScreen)
      .catch(function (error) {
        console.log("Error editing phone screen: ", error);
      });
    }
  };

  $scope.moveToOnSite = function () {
    var newOnSite = {
      user_id: $rootScope.selectedPhoneScreen.user_id,
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
    $rootScope.selectedPhoneScreenIndex = index;
  };

  // Function for submitting any updated changes to a specific phoneScreen
  $scope.submitChanges = function () {
    PhoneScreen.editPhoneScreen($rootScope.selectedPhoneScreen)
      .then(function (phoneScreen) {
        $rootScope.phoneScreens.splice($rootScope.selectedPhoneScreenIndex, 1, phoneScreen);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to phoneScreen: ", error);
      });

      if ($rootScope.selectedPhoneScreen.status === "Accepted") {
        $scope.moveToOnSite();
      }
  };

  $scope.getPhoneScreens();
})

.factory('PhoneScreen', function ($http) {

  var getPhoneScreens = function (userId) {
    return $http({
      method: 'GET',
      url: '/api/phonescreens',
      params: {
        userId: userId
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
