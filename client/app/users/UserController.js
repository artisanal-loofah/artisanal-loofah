angular.module('hunt.users', [])

.controller('UserController', function huntUsers($scope, $location, $rootScope, $http, $window, User) {
  $scope.initializeApp = function() {
    if (!User.isAuth()) {
      $scope.getLinkedInData(function() {
        $location.path("/main");
      });
    } else {
      var linkedInId = $window.localStorage.getItem('hunt_userprofile_id');
      User.getUserByLinkedInId(linkedInId)
      .then(function(data) {
        $rootScope.user = data.user;
        $location.path("/main");
      })
      .catch(function(error){
        console.error(error);
      })
    }
  };

  $scope.getLinkedInData = function (callback) {
    IN.API.Profile("me").fields([ "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl", "headline" ])
    .result(function(result) {
      $rootScope.$apply(function() {
        $rootScope.userprofile = result.values[0];
        $window.localStorage.setItem('hunt_userprofile_id', $rootScope.userprofile.id);
        User.getUserByLinkedInId($rootScope.userprofile.id)
        .then(function(data) {
          if (data.user) {
            $rootScope.user = data.user;
            $window.localStorage.setItem('hunt_token', data.token);
            callback();
          } else {
            User.createUser($rootScope.userprofile)
              .then(function (data) {
                $rootScope.user = data.user;
                $window.localStorage.setItem('hunt_token', data.token);
                callback();
              });
          }
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
    $window.localStorage.removeItem('hunt_token');
    $window.localStorage.removeItem('hunt_userprofile_id');
    $location.path('/signin');
  };
});
