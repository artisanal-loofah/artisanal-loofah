angular.module('hunt.phoneScreen', ['hunt.appSubmit'])

.controller('PhoneScreenController', function ($scope, $rootScope, $window, PhoneScreen) {
  $rootScope.phoneScreens = [];
  $rootScope.selectedPhoneScreenIndex;

  $scope.getPhoneScreens = function () {
    PhoneScreen.getPhoneScreens($window.localStorage.getItem('user_id'))
    .then(function (data) {
      $rootScope.phoneScreens = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.removePhoneScreen = function () {

  };

  $scope.moveToOnSite = function () {

  };

  // Function that sets the phoneScreenID when user clicks on phoneScreen
  $scope.clickedPhoneScreen = function (phoneScreen, index) {
    $rootScope.phoneScreenID = phoneScreen.id;
    $rootScope.selectedPhoneScreenIndex = index;
  };

  // Function for submitting any updated changes to a specific phoneScreen
  $scope.submitChanges = function () {

    var phoneScreenChanges = {
      id: $rootScope.phoneScreenID,
      notes: $scope.phoneScreenNotes,
      status: $scope.phoneScreenStatus
    };

    PhoneScreen.editPhoneScreen(phoneScreenChanges)
      .then(function (phoneScreen) {
        $rootScope.phoneScreens.splice($rootScope.selectedPhoneScreenIndex, 1, phoneScreen);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to phoneScreen: ", error);
      });
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
