angular.module('hunt.phoneScreen', [])

.controller('PhoneScreenController', function ($scope, $window, PhoneScreenFactory) {
  $scope.phoneScreenList = [];

  $scope.getPhoneScreens = function () {
    PhoneScreenFactory.findAll($window.localStorage.getItem('user_id'))
    .then(function (phoneScreenList) {
      $scope.phoneScreenList = phoneScreenList;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.modify = function (phoneScreenListItem) {
    PhoneScreenFactory.edit(phoneScreenListItem);
  };

  $scope.removePhoneScreen = function (phoneScreenListItem) {
    PhoneScreenFactory.edit(phoneScreenListItem);
  };
  $scope.getPhoneScreens();
})

.factory('PhoneScreenFactory', function ($http) {
  var findAll = function (userId) {
    return $http({
      method: 'GET',
      url: 'api/phonescreens',
      params: {
        userId: userId
      }
    }).then(function (response) {
      return response.data;
    }).catch(function (error) {
      console.error(error);
    })
  };

  var addNew = function (phoneScreenListItem) {
    return $http({
      method: 'POST',
      url: 'api/phonescreens',
      data: phoneScreenListItem
    }).then(function (response) {
      return response.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var edit = function (phoneScreenListItem) {
    return $http({
      method: 'PUT',
      url: 'api/phonescreens',
      data: phoneScreenListItem
    }).then(function (response) {
      return response.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  return {
    findAll: findAll,
    addNew: addNew,
    edit: edit
  }
});