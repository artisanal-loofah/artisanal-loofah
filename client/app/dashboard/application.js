angular.module('hunt.application', ['hunt.users'])

.controller('ApplicationController', function ($scope, Application) {
  $scope.test = 'test string scope';
  $scope.addApplication = function (){
    var applicationData = {
      userId: 1,
      jobTitle: $scope.jobTitle,
      company: $scope.company
    };
    Application.addApplication(applicationData);

  };

});
