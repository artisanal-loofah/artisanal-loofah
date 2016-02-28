angular.module('hunt.services', [])

.factory('User', function($http, $window) {
  var getUserByLinkedInId = function(linkedInId) {
    return $http({
      method: 'GET',
      url: '/api/users',
      params: {
        linkedInId: linkedInId
      }
    }).then(function(res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var createUser = function(userData) {
    return $http({
      method: 'POST',
      url: '/api/users',
      data: userData
    }).then(function(res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var isAuth = function() {
    return !!$window.localStorage.getItem('hunt_token');
  };

  return {
    getUserByLinkedInId: getUserByLinkedInId,
    createUser: createUser,
    isAuth: isAuth
  }
});
