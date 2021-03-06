angular.module('hunt.users', [])

.controller('UserController', function huntUsers($scope, $location, $rootScope, $http, $window, User) {
  // Authenticates through LinkedIn if token not in local storage
  // If in local storage, get user and route to main page.
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

  // Get the user from the db using the LinkedIn id provided by the LinkedIn Auth call.
  // If user does not exist, create user with LI data. Set token and LI id in local storage
  // and call callback (callback above is reroute to main page).
  $scope.getLinkedInData = function (callback) {
    IN.API.Profile("me").fields([ "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl", "headline" ])
    .result(function(result) {
      $rootScope.$apply(function() {
        var linkedInProfile = result.values[0];
        $window.localStorage.setItem('hunt_userprofile_id', linkedInProfile.id);
        User.getUserByLinkedInId(linkedInProfile.id)
        .then(function(data) {
          if (data.user) {
            $rootScope.user = data.user;
            $window.localStorage.setItem('hunt_token', data.token);
            callback();
          } else {
            User.createUser(linkedInProfile)
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
    delete $rootScope.user;
    $window.localStorage.removeItem('hunt_token');
    $window.localStorage.removeItem('hunt_userprofile_id');
    $location.path('/signin');
  };
});
