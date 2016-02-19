angular.module('hunt.users', [])

.controller('UserController', function huntUsers($scope, $location, $rootScope, $http) {
  $scope.user = {};

  $scope.getLinkedInData = function () {
    if (!Object.keys($scope.user).length) {
      IN.API.Profile("me").fields(
          [ "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl" ])
        .result(function(response) {
          console.log(response);
          $scope.user = response.values[0];
          $location.path("/main");
      }).error(function(err) {
        $scope.error = err;
      });
    }
  };

  $scope.logoutLinkedIn = function () {
    IN.User.logout();
    $scope.user = {};
    $location.path('/signin');
  }
})