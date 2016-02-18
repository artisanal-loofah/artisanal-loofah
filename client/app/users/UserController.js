angular.module('hunt.users', [])

.controller('UserController', function ($scope, $window, $location, UserFactory) {

  $scope.linkedinMsg = {};
  $scope.showLinkedinLogin = true;
  $scope.showEmailForm = true;

  $scope.signIn = function (data) {
    console.log('profile data from cb: ', data);
  };

  $scope.signOut = function () {
    UserFactory.signOut();
  };

})

.factory('UserFactory', function ($http) {




})