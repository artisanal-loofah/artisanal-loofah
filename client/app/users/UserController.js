angular.module('hunt.users', [])

.controller('UserController', function huntUsers($scope, $location, $rootScope, $http) {
 
 $scope.getLinkedInData = function () {
   if(!$scope.hasOwnProperty("userprofile")){
     IN.API.Profile("me").fields(
         [ "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl" ])
       .result(function(result) {
         console.log(result)
       $rootScope.$apply(function() {
         $rootScope.userprofile = result.values[0];
         $rootScope.loggedUser = true;
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
   $location.path('/signin');
 }
})