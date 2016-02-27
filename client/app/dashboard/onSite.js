angular.module('hunt.onSite', [])

.controller('OnSiteController', function ($scope, $rootScope, $window, OnSite) {
  $rootScope.onSites = [];
  $rootScope.selectedOnSite;
  $rootScope.selectedOnSiteIndex;

  $scope.getOnSites = function () {
    OnSite.getOnSites($window.localStorage.getItem('user_id'))
    .then(function (data) {
      $scope.onSites = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.modify = function (onSiteListItem) {
    OnSiteFactory.edit(onSiteListItem);
  };

  $scope.removeOnSite = function (onSiteListItem) {
    // OnSiteFactory.edit(onSiteListItem);
  };

  $scope.moveToOffer = function() {

  };

  $scope.clickedOnSite = function(onSite, index) {
    $rootScope.selectedOnSite = onSite;
    $rootScope.selectedOnSiteIndex = index;
  };

  $scope.submitChanges = function() {
    OnSite.editOnSite($rootScope.selectedOnSite)
      .then(function (onSite) {
        $rootScope.onSites.splice($rootScope.selectedOnSiteIndex, 1, onSite);
      })
      .catch(function (error) {
        console.error("There was an error submitting changes to onSite: ", error);
      });
  };

  $scope.getOnSites();
})

.factory('OnSite', function ($http) {
  var getOnSites = function (userId) {
    return $http({
      method: 'GET',
      url: '/api/onsites',
      params: {
        userId: userId
      }
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var addOnSite = function (onSite) {
    return $http({
      method: 'POST',
      url: 'api/onesites',
      data: onSite
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var editOnSite = function (onSite) {
    return $http({
      method: 'PUT',
      url: 'api/onsites',
      data: onSite
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    })
  };

  return {
    getOnSites: getOnSites,
    addOnSite: addOnSite,
    editOnSite: editOnSite
  }
});