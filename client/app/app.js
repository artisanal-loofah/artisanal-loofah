angular.module('huntApp', [
  'hunt.users',
  'ngRoute'])

.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/signin', {
      templateUrl: 'app/users/signin.html'
    })
    .when('/main', {
      templateUrl: 'app/home/main.html',
      controller: 'UserController'
    })
    .otherwise({
      redirectTo: '/main'
    });
  }
);