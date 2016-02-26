angular.module('hunt.offers', [])

.controller('OffersController', function ($scope, $rootScope, $window, Offers) {
  $rootScope.offers = [];
  $rootScope.selectedOfferIndex;

  $scope.getOffers = function () {
    Offers.getOffers($window.localStorage.getItem('user_id'))
    .then(function (data) {
      $rootScope.offers = data;
      console.log($rootScope.offers);
    }).catch(function (error) {
      console.error(error);
    });
  };

  // Function that sets the offerID when user clicks on Offer
  $scope.clickedBacklog = function (offer, index) {
    $rootScope.offerID = offer.id;
    $rootScope.selectedOfferIndex = index;
  };

  $scope.getOffers();

})

.factory('Offers', function ($http) {

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

  return {
    getOffers: getOffers
  };
});