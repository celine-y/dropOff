'use strict';

// Declare app level module which depends on views, and components
angular.module('dropOff', [
  'ngRoute',
  'dropOff.login',
  'dropOff.register',
  'dropOff.home',
  'dropOff.makeTrip',
  'dropOff.driver'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider
  .when('/home', {
		templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  })
  .when('/login', {
		templateUrl: 'login/login.html',
		controller: 'LoginCtrl'
  })
  .when('/register', {
		templateUrl: 'register/register.html',
		controller: 'RegisterCtrl'
  })
  .when('/makeTrip', {
    templateUrl: 'driver/makeTrip/makeTrip.html',
    controller: 'makeTripCtrl'
  })
  .when('/driver', {
    templateUrl: 'driver/driver.html',
    controller: 'driverCtrl'
  })
  .otherwise({redirectTo: '/login'});
}]);
