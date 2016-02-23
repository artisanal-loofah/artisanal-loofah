angular.module('hunt.onSite', [])

.controller('OnSiteController', function ($scope, $rootScope, OnSiteFactory) {
  $scope.onSiteList = [];

  $scope.getOnSites = function () {
    OnSiteFactory.findAll($rootScope.user.id)
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

  $rootScope.initializeOnSites = $scope.getOnSites;
})

.factory('OnSiteFactory', function ($http) {
  var findAll = function (userId) {
    return $http({
      method: 'GET',
      url: '/api/onsites',
      params: {
        userId: userId
      }
    }).then(function (response) {
      return response.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var addNew = function (onSiteListItem) {
    return $http({
      method: 'POST',
      url: 'api/onesites',
      data: onSiteListItem
    }).then(function (response) {
      // not sure if return needed; we'll see when called from backlogController
      return response.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var edit = function (onSiteListItem) {
    return $http({
      method: 'PUT',
      url: 'api/onsites',
      data: onSiteListItem
    }).then(function (response) {
      // not sure if return needed
      return response.data;
    }).catch(function (error) {
      console.error(error);
    })
  };

  return {
    findAll: findAll,
    addNew: addNew,
    edit: edit
  }
});