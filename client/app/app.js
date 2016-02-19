angular.module('huntApp', [
 'hunt.users',
 'ngRoute'])
  'hunt.users',
  'hunt.services',
  'hunt.backlog',
  'hunt.appSubmit',
  'hunt.phoneScreen',
  'hunt.onSite',
  'hunt.offers',
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
     redirectTo: '/signin'
   });
 }
);