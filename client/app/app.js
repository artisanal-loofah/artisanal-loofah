<<<<<<< HEAD
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
=======
angular.module('hunt', [])


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
>>>>>>> 6fcb0961145f5dbed76d2b4417d72b6d66d2893b
