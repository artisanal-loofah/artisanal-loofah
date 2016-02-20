angular.module('hunt.appSubmit', ['hunt.backlog'])

.controller('AppSubmitController', function ($scope, AppSubmitFactory) {
  $scope.appSubmitInfo = {};
  $scope.appSubmitList = [];

  $scope.getAppSubmits = function () {
    AppSubmitFactory.findAll();
  };

  $scope.modify = function (target) {
    AppSubmitFactory.edit(target);
  };

  $scope.removeApp = function (target) {
    AppSubmitFactory.removeApp(target);
  };


  $scope.getAppSubmits();
})

.factory('AppSubmitFactory', function ($http) {

  var findAll = function (callback) {
    return $http({
      method: 'GET',
      url: '/api/appsubmits'
    }).then(function (response) {
      if (callback) {
        return callback(response.data);
      } else {
        return response.data;
      }
    })
  };

  var addNew = function (data) {
    return $http({
      method: 'POST',
      url: 'api/appsubmits',
      data: data
    }).then(function (response) {
      response.status = 200
      return response;
    });
  };

  var edit = function (data) {
    return $http({
      method: 'POST',
      url: 'api/appsubmits',
      data: data
    }).then(function (response) {
      response.status = 200
      return response;
    })
  }

  return {
    findAll: findAll,
    addNew: addNew,
    edit: edit
  }

});
