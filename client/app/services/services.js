angular.module('hunt.services', [])

.factory('User', function($http) {
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

  var getUserById = function(id) {
    return $http({
      method: 'GET',
      url: '/api/users',
      params: {
        id: id
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
      return res;
    }).catch(function (error) {
      console.error(error);
    });
  };

  return {
    getUserById: getUserById,
    getUserByLinkedInId: getUserByLinkedInId,
    createUser: createUser
  }
});
