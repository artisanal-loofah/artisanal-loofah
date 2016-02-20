angular.module('hunt.onSite', [])

.controller('OnSiteController', function ($scope, OnSiteFactory) {
  $scope.onSiteList = [];

  $scope.getOnSites = function () {
    OnSiteFactory.findAll()
    .then(function (onSiteList) {
      $scope.onSiteList = onSiteList;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.modify = function (onSiteListItem) {
    OnSiteFactory.edit(onSiteListItem);
  };

  $scope.removeOnSite = function (onSiteListItem) {
    OnSiteFactory.edit(onSiteListItem);
  };

  $scope.getOnSites();
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