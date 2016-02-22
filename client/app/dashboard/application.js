angular.module('hunt.application', ['hunt.users'])

.controller('ApplicationController', function ($scope, $rootScope, Application, Backlog) {

  $scope.addApplication = function (){
    var applicationData = {
      userId: $rootScope.user.id,
      jobTitle: $scope.jobTitle,
      company: $scope.company
    };
    Application.createApplication(applicationData)
    .then(function(application) {
      var newBacklog = {
        application_id: application.id,
        status: 'Pending'
      }
      Backlog.addBacklog(newBacklog);
    })
  };

  // $scope.fakeData = Application.backlog;
})

.factory('Application', function ($http) {
  var getApplications = function(userId) {
    return $http({
      method: 'GET',
      url: '/api/applications',
      params: {
        userId: userId
      }
    }).then(function(res) {
      return res.data;
    }).catch(function(error) {
      console.error(error);
    })
  };

  var createApplication = function(app) {
    return $http({
      method: 'POST',
      url: '/api/applications',
      data: app
    }).then(function(res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    })
  };

  return {
    getApplications: getApplications,
    createApplication: createApplication
  }
});
