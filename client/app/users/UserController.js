angular.module('hunt.users', [])

.controller('UserController', function huntUsers($scope, $location, $rootScope, $http, $window, User) {
  $scope.initializeApp = function() {
    if (!isLoggedIn()) {
      $scope.getLinkedInData(function() {
        $location.path("/main");
      });
    } else {
      var id = $window.localStorage.getItem('user_id');
      User.getUserById(id)
      .then(function(user) {
        $rootScope.user = user;
        $location.path("/main");
      });
    }
  };

  $scope.getLinkedInData = function (callback) {
    IN.API.Profile("me").fields([ "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl", "headline" ])
    .result(function(result) {
      $rootScope.$apply(function() {
        $rootScope.userprofile = result.values[0];
        $rootScope.loggedUser = true;

        User.getUserByLinkedInId($rootScope.userprofile.id)
        .then(function(user) {
          // test if user is empty object
          if (user) {
            $rootScope.user = user;
          } else {
            $rootScope.user = User.createUser($rootScope.userprofile);
          }
          $window.localStorage.setItem('user_id', $rootScope.user.id);
          callback();
        })
        .catch(function(err) {
          console.error(err);
        });
      });
    }).error(function(err) {
      $scope.error = err;
    });
  };

  $scope.logoutLinkedIn = function () {
    IN.User.logout();
    delete $rootScope.userprofile;
    delete $rootScope.user;
    $rootScope.loggedUser = false;
    $window.localStorage.removeItem('user_id');
    $location.path('/signin');
  };
});
