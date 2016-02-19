angular.module('huntApp', ['huntCtrl', 'ngRoute'])

.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/signin', {
      templateUrl: 'app/users/signin.html'
    })
    .when('/main', {
      templateUrl: 'app/home/main.html',
      controller: 'huntCtrl'
    })
    .otherwise({
      redirectTo: '/main'
    });
  }
);