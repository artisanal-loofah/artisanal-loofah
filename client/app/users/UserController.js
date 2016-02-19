angular.module('huntCtrl', [])

.controller('huntCtrl', function HuntCtrl($scope, $location, $rootScope, $http) {
  $scope.getLinkedInData = function () {
    if (!$scope.hasOwnProperty('userprofile')) {
      IN.API.Profile("user").fields(
        ['id', 'firstName', 'lastName', 'pictureUrl'])
      .result(function (result) {
        $rootScope.apply(function () {
          var userprofile = result.value[0];
          $rootScope.userprofile = userprofile;
          $rootScope.loggedUser = true;
          $location.path('/main');

        });
      }).error(function (error) {
        $scope.error = error;
        console.error(error);
      })
    }
  }

  $scope.logoutLinkedIn = function () {
    IN.User.logout();
    delete $rootScope.userprofile;
    $rootScope.loggedUser = false;
    $location.path('/signin');
  }

})