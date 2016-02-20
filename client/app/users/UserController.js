angular.module('hunt.users', [])

.controller('UserController', function huntUsers($scope, $location, $rootScope, $http, $window, User) {
 

  $scope.getLinkedInData = function () {
    $scope.userData = {};
    $scope.user = {};

    if(!$scope.hasOwnProperty("userprofile")){
      IN.API.Profile("me").fields([ "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl", "headline" ])
      .result(function(result) {
        $window.localStorage.setItem('com.token', null);
        $rootScope.$apply(function() {

          $rootScope.userprofile = result.values[0];
          $scope.userData = result.values[0];
          $rootScope.loggedUser = true;

          User.getUser($scope.userData.id)
          .then(function(res) {
            // test if user is empty object
            if (res.data) {
              $scope.user = res.data;
            } else {
              $scope.user = User.createUser($scope.userData);
            }
            $location.path("/main");
          })
          .catch(function(err) {
            console.error(err);
          })

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
  };
});
