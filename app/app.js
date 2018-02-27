'use strict';

// Declare app level module which depends on views, and components
angular.module('dropOff', [
  'ngRoute',
  'dropOff.login',
  'dropOff.register',
  'dropOff.home',
  'dropOff.view1',
  'dropOff.view2',
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
  .when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  })
  .when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  })
  .otherwise({redirectTo: '/login'});
}]);
