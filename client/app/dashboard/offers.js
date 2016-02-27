angular.module('hunt.offers', [])

.controller('OffersController', function ($scope, $rootScope, $window, Offers) {
  $rootScope.offers = [];
  $rootScope.selectedOffer;
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
  $scope.clickedOffer = function (offer, index) {
    $rootScope.selectedOffer = offer;
    $rootScope.selectedOfferIndex = index;
  };

  $scope.submitChanges = function () {
    var offerChanges = {
      id: $rootScope.selectedOffer.id,
      notes: $scope.offerNotes,
      status: $scope.offerStatus,
      deadline: $scope.offerDeadline,
      salary: $scope.offerSalary
    };

    if ($rootScope.selectedOffer.status === 'Accepted' || $rootScope.selectedOffer.status === 'Rejected' || $rootScope.selectedOffer.status === 'Pending') {
      Offers.editOffer(offerChanges)
      .then(function (offer) {
        $rootScope.offers.splice($rootScope.selectedOfferIndex, 1, offer);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to offers: ", error);
      });
    } else {
      console.error('appropriate value for status needed');
    }

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

  var editOffer = function (offer) {
    console.log('clientside offer: ', offer);
    return $http({
      method: 'PUT',
      url: '/api/offers',
      data: offer
    })
    .then(function (res) {
      return res.data;
    });
  };

  return {
    getOffers: getOffers,
    editOffer: editOffer
  };
});