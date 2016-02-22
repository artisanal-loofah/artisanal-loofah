angular.module('hunt.application', ['hunt.users'])

.controller('ApplicationController', function ($scope, Application, $rootScope) {

  $scope.addApplication = function (){
    var applicationData = {
      userId: $rootScope.user.id,
      jobTitle: $scope.jobTitle,
      company: $scope.company
    };
    //sends applicationData Object to the Application Factory defined in the services folder which will 
    //send a HTTP request to the server
    Application.addApplication(applicationData);

  };


  $scope.fakeData = Application.backlog;

});