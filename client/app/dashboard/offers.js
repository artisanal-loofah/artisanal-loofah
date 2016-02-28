angular.module('hunt.offer', [])

.controller('OfferController', function ($scope, $rootScope, $window, Offer) {
  $rootScope.offers = [];
  $rootScope.selectedOffer;
  $rootScope.selectedOfferIndex;
  $scope.sort = 'created';

  $scope.test = function(sort) {
    console.log(sort);
  }

  $scope.getOffers = function () {
    // user id is added on the backend
    Offer.getOffers()
    .then(function (data) {
      $rootScope.offers = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.removeOffer = function (offer, index) {
    if (window.confirm("Are you sure you want to remove this item from this stage?")){
      offer.status = 'Removed';
      $rootScope.offers.splice(index, 1);
      Offer.editOffer(offer)
      .catch(function (error) {
        console.log("Error editing offer: ", error);
      });
    }
  };

  $scope.clickedOffer = function(offer, index) {
    $rootScope.selectedOffer = offer;
    // convert string (if it exists) to Date object
    if ($rootScope.selectedOffer.deadline) {
      $rootScope.selectedOffer.deadline = new Date($rootScope.selectedOffer.deadline);
    }
    $rootScope.selectedOfferIndex = index;
  };

  $scope.submitChanges = function() {
    Offer.editOffer($rootScope.selectedOffer)
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
  var getOffers = function () {
    return $http({
      method: 'GET',
      url: '/api/offers'
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