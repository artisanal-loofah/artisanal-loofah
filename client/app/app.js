angular.module('huntApp', [
  'hunt.users',
  'hunt.services',
  'hunt.backlog',
  'hunt.appSubmit',
  'hunt.phoneScreen',
  'hunt.onSite',
  'hunt.offers',
  'ngRoute'])

.config(function ($routeProvider, $locationProvider, $httpProvider) {
   $routeProvider
   .when('/signin', {
     templateUrl: 'app/users/signin.html'
   })
   .when('/main', {
     templateUrl: 'app/home/main.html',
     controller: 'UserController'
   })
   .otherwise({
     redirectTo: '/signin'
   });

   $httpProvider.interceptors.push('AttachTokens');
 
})

.factory('AttachTokens', function ($window) {
    var attach = {
    request: function (object) {
     // console.log('are we attaching tokens? :', object);
      var jwt = $window.localStorage.getItem('com.token');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})