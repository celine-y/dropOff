'use strict';

// Declare app level module which depends on views, and components
angular.module('dropOff', [
  'ngRoute',
  'dropOff.login',
  'dropOff.register',
  'dropOff.home',
  'dropOff.version'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

  $routeProvider
  .when('/home',{
		templateUrl: 'home/home.html',
    controller: 'HomeCtrl',
    permissions: ['driver', 'rider']
  })
  .when('/login', {
		templateUrl: 'login/login.html',
		controller: 'LoginCtrl'
  })
  .when('/register', {
		templateUrl: 'register/register.html',
		controller: 'RegisterCtrl'
  })
  .otherwise({redirectTo: '/login'});
}]);
