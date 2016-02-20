angular.module('hunt.application', ['hunt.users'])

.controller('ApplicationController', function ($scope, Application, $rootScope) {
  $scope.test = 'test string scope';
  $scope.addApplication = function (){
    var applicationData = {
      userId: $rootScope.user.id,
      jobTitle: $scope.jobTitle,
      company: $scope.company
    };
    Application.addApplication(applicationData);

  };

});
