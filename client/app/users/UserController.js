angular.module('hunt.users', [])

.controller('UserController', function huntUsers($scope, $location, $rootScope, $http, $window) {
 

  $scope.getLinkedInData = function () {
    $scope.userData = {};

    if(!$scope.hasOwnProperty("userprofile")){
      IN.API.Profile("me").fields([ "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl", "headline" ])
      .result(function(result) {
        $window.localStorage.setItem('com.token', null);
        $rootScope.$apply(function() {
         $rootScope.userprofile = result.values[0];
         $scope.userData = result.values[0];
         $rootScope.loggedUser = true;
         $scope.saveUser();
         $location.path("/main");
        });
      }).error(function(err) {
        $scope.error = err;
      });
    }
  };

  $scope.logoutLinkedIn = function () {
    IN.User.logout();
    delete $rootScope.userprofile;
    $rootScope.loggedUser = false;
    $window.localStorage.removeItem('com.token');
    $location.path('/signin');
  }

  $scope.saveUser = function () {
    $http({
      method: 'POST',
      url: '/api/users',
      data: $scope.userData
    }).catch(function (error) {
      console.error(error);
    });
  } 
});