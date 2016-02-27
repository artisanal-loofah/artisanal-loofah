angular.module('hunt.users', [])

.controller('UserController', function huntUsers($scope, $location, $rootScope, $http, $window, User) {
  $scope.initializeApp = function() {
    // if (!User.isAuth()) {
      $scope.getLinkedInData(function() {
        $location.path("/main");
      });
    // } else {
    //   // console.log('set rootscope user in initliazeapp: ', $rootScope.user);
    //   // var token = $window.localStorage.getItem('hunt_token');
    //   // User.getUserByLinkedInId(id)
    //   // .then(function(user) {
    //   //   $rootScope.user = user;
    //   //   $location.path("/main");
    //   // });
    // }
  };

  $scope.getLinkedInData = function (callback) {
    IN.API.Profile("me").fields([ "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl", "headline" ])
    .result(function(result) {
      $rootScope.$apply(function() {
        $rootScope.userprofile = result.values[0];
        $rootScope.loggedUser = true;
        User.getUserByLinkedInId($rootScope.userprofile.id)
        .then(function(data) {
          // console.log('user in getlinked...: ', user);
          // if (user) {
          //   $rootScope.user = user;
          // } else {
            // User.createUser($rootScope.userprofile)
            //   .then(function (user) {
            //     $rootScope.user = user;
            //   });
          // }
          if (data.user) {
            $rootScope.user = data.user;
            console.log('set rootscope user in getlidata: ', $rootScope.user);
            $window.localStorage.setItem('hunt_token', data.token);
            callback();
          } else {
            User.createUser($rootScope.userprofile)
              .then(function (data) {
                $rootScope.user = data.user;
                console.log('set rootscope user in getlidata: ', $rootScope.user);
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
    $rootScope.loggedUser = false;
    $window.localStorage.removeItem('hunt_token');
    $location.path('/signin');
  };
});
