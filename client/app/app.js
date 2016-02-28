angular.module('huntApp', [
  'hunt.users',
  'hunt.services',
  'hunt.backlog',
  'hunt.appSubmit',
  'hunt.phoneScreen',
  'hunt.onSite',
  'hunt.offer',
  'hunt.application',
  'ngRoute'])

.config(function ($routeProvider, $locationProvider, $httpProvider) {
   $routeProvider
   .when('/signin', {
     templateUrl: 'app/users/signin.html'
   })
   .when('/main', {
     templateUrl: 'app/home/main.html',
     controller: 'UserController',
     authenticate: true
   })
   .otherwise({
     redirectTo: '/main'
   });

   $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('hunt_token');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, $window, User) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !User.isAuth()) {
      $location.path('/signin');
    }
  });
});
