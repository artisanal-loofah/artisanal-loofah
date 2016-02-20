angular.module('hunt.appSubmit', ['hunt.backlog'])

.controller('AppSubmitController', function ($scope, AppSubmitFactory) {
  $scope.appSubmitInfo = {};
  $scope.appSubmitList = [];

  $scope.getAppSubmits = function () {
    AppSubmitFactory.findAll().then(function (data) {
      $scope.appSubmitList = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.modify = function (target) {
    AppSubmitFactory.edit(target);
  };

  $scope.removeApp = function (target) {
    AppSubmitFactory.edit(target);
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
    }).catch(function (error) {
      console.error(error);
    });
  };

  var addNew = function (data) {
    return $http({
      method: 'POST',
      url: 'api/appsubmits',
      data: data
    }).then(function (response) {
      // not sure if return needed; we'll see when called from backlogController
      return response;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var edit = function (data) {
    return $http({
      method: 'POST',
      url: 'api/appsubmits',
      data: data
    }).then(function (response) {
      // not sure if return needed
      return response;
    }).catch(function (error) {
      console.error(error);
    });
  };

  return {
    findAll: findAll,
    addNew: addNew,
    edit: edit
  }

});
