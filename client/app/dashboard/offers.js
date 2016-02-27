angular.module('hunt.offer', [])

.controller('OfferController', function ($scope, $rootScope, $window, Offer) {
  $rootScope.offers = [];
  $rootScope.selectedOffer;
  $rootScope.selectedOfferIndex;

  $scope.getOffers = function () {
    offer.getOffers($window.localStorage.getItem('user_id'))
    .then(function (data) {
      $scope.offers = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.removeOffer = function (offer) {

  };

  $scope.moveToOffer = function() {

  };

  $scope.clickedOffer = function(offer, index) {
    $rootScope.selectedOffer = offer;
    $rootScope.selectedOfferIndex = index;
  };

  $scope.submitChanges = function() {
    offer.editOffer($rootScope.selectedOffer)
      .then(function (offer) {
        $rootScope.offers.splice($rootScope.selectedOfferIndex, 1, offer);
      })
      .catch(function (error) {
        console.error("There was an error submitting changes to offer: ", error);
      });
  };

  $scope.getOffers();
})

.factory('Offer', function ($http) {
  var getOffers = function (userId) {
    return $http({
      method: 'GET',
      url: '/api/offers',
      params: {
        userId: userId
      }
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var addOffer = function (offer) {
    return $http({
      method: 'POST',
      url: 'api/offers',
      data: offer
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var editOffer = function (offer) {
    return $http({
      method: 'PUT',
      url: 'api/offers',
      data: offer
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    })
  };

  return {
    getOffers: getOffers,
    addOffer: addOffer,
    editOffer: editOffer
  }
});