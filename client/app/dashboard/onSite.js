angular.module('hunt.onSite', [])

.controller('OnSiteController', function ($scope, $rootScope, $window, OnSite, Offer, Helpers) {
  $rootScope.onSites = [];
  $rootScope.selectedOnSite;
  $rootScope.selectedOnSiteIndex;
  $scope.sort = 'created';

  $scope.getOnSites = function (sort) {
    // user id is added on the backend
    OnSite.getOnSites(sort)
    .then(function (data) {
      $rootScope.onSites = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.removeOnSite = function (onSite, index) {
    if (window.confirm("Are you sure you want to remove this item from this stage?")){
      onSite.status = 'Removed';
      $rootScope.onSites.splice(index, 1);
      OnSite.editOnSite(onSite)
      .catch(function (error) {
        console.log("Error editing on-site: ", error);
      });
    }
  };

  $scope.moveToOffer = function() {
    // user id is added on the backend
    var newOffer = {
      application_id: $rootScope.selectedOnSite.application_id,
      status: 'Pending',
      salary: $scope.newOfferSalary,
      deadline: $scope.newOfferDeadline,
      notes: $scope.newOfferNotes
    };

    Offer.addOffer(newOffer)
      .then(function (offer) {
        $rootScope.offers.push(offer);
      })
      .catch(function (error) {
        console.log("Error creating Offer list item on OnSite status change : ", error);
      });

    $scope.newOfferSalary = null;
    $scope.newOfferDeadline = null;
    $scope.newOfferNotes = null;
  };

  $scope.clickedOnSite = function(onSite, index) {
    $rootScope.selectedOnSite = onSite;
    // convert string (if it exists) to Date object
    if ($rootScope.selectedOnSite.date_time) {
      $rootScope.selectedOnSite.date_time = new Date($rootScope.selectedOnSite.date_time);
    }
    $rootScope.selectedOnSiteIndex = index;
  };

  $scope.submitChanges = function() {
    var selectedOnSite = $rootScope.selectedOnSite;
    OnSite.editOnSite(selectedOnSite)
      .then(function (onSite) {
        $rootScope.onSites.splice($rootScope.selectedOnSiteIndex, 1, onSite);
      })
      .catch(function (error) {
        console.error("There was an error submitting changes to onSite: ", error);
      });

      if (selectedOnSite.status === "Accepted" && Helpers.isNotDuplicate($rootScope.offers, selectedOnSite.application_id)) {
        $scope.moveToOffer();
      }
  };

  $scope.getOnSites();
})

.factory('OnSite', function ($http) {
  var getOnSites = function (sort) {
    return $http({
      method: 'GET',
      url: '/api/onsites',
      params: {
        sort: sort
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
      url: 'api/onsites',
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