angular.module('hunt.onSite', [])

.controller('OnSiteController', function ($scope, OnSiteFactory) {
  $scope.onSiteList = [];

  $scope.getOnSites = function () {
    OnSiteFactory.findAll()
    .then(function (onSites) {
      $scope.onSiteList = onSites;
    }).catch(function (error) {
      console.error(error);
    });
  };
})

.factory('OnSiteFactory', function ($http) {
  var findAll = function (callback) {
    return $http({
      method: 'GET',
      url: '/api/onsites'
    }).then(function (response) {
      if (callback) {
        return callback(response.data);
      } else {
        return response.data;
      }
    })
  };

  return {
    findAll: findAll
  }
});