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

});