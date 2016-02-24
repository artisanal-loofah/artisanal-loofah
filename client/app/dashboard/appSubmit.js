angular.module('hunt.appSubmit', ['hunt.backlog'])

.controller('AppSubmitController', function ($scope, $rootScope, $window, AppSubmitFactory) {
  $scope.appSubmitInfo = {};
  $scope.appSubmitList = [];

  $scope.getAppSubmits = function () {
    //console.log('windowlocalstorage: ', $window.localStorage.user_id);
    AppSubmitFactory.findAll($window.localStorage.getItem('user_id'))
    .then(function (data) {
      //console.log('data from appsubmits: ', data);
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

  var findAll = function (userId) {
    return $http({
      method: 'GET',
      url: '/api/appsubmits',
      params: {
        userId: userId
      }
    }).then(function (response) {
      return response.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var addNew = function (appId) {
    console.log('appid from backlog: ', appId)
    var stuff = {
      application_id: appId.toString()
    };
    return $http({
      method: 'POST',
      url: 'api/appsubmits',
      data: stuff
    }).then(function (response) {
      // not sure if return needed; we'll see when called from backlogController
      return response;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var edit = function (data) {
    return $http({
      method: 'PUT',
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
  };
});
