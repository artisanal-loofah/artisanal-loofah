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
})

.run(function ($rootScope, $location, $window) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !isLoggedIn()) {
      $location.path('/signin');
    }
  });
});
