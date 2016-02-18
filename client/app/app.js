angular.module('hunt', [
  'hunt.users'])


.config(['$routeProvider', '$locationProvider', '$httpProvider', 
  function ($routerProvider, $locationProvider) {
    $routerProvider
    .when('/signin', {
      templateUrl: 'users/signin.html'
    })
    .when('/main', {
      templateUrl: 'home/main.html',
      controller: 'UserController'
    })
    .otherwise({
      redirectTo: '/signin'
    });
  }
]);