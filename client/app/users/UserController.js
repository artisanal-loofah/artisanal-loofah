angular.module('hunt.users', [])

.controller('UserController', function huntUsers($scope, $location, $rootScope, $http, $window, User) {
 

  $scope.getLinkedInData = function () {
    // $scope.userData = {};
    // $scope.user = {};

    if(!$scope.hasOwnProperty("userprofile")){
      IN.API.Profile("me").fields([ "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl", "headline" ])
      .result(function(result) {
        $window.localStorage.setItem('com.token', null);
        $rootScope.$apply(function() {

          $rootScope.userprofile = result.values[0];
          // $scope.userData = result.values[0];
          $rootScope.loggedUser = true;

          User.getUser($rootScope.userprofile.id)
          .then(function(res) {
            // test if user is empty object
            if (res.data) {
              $rootScope.user = res.data;
            } else {
              $rootScope.user = User.createUser($rootScope.userprofile);
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
    delete $rootScope.user;
    $rootScope.loggedUser = false;
    $window.localStorage.removeItem('com.token');
    $location.path('/signin');
  };
});
