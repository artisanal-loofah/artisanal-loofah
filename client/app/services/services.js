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
})

.factory('Helpers', function() {
  // check if a list item with this application id already exists
  var isNotDuplicate = function(nextStageListItems, application_id) {
    for (var i = 0; i < nextStageListItems.length; i++) {
      if (nextStageListItems[i].application_id === application_id) {
        return false;
      }
    }
    return true;
  };

  return {
    isNotDuplicate: isNotDuplicate
  }
});
