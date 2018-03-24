'use strict';

// Declare app level module which depends on views, and components
angular.module('dropOff', [
  'ngRoute',
  'dropOff.login',
  'dropOff.register',
  'dropOff.home',
  'dropOff.makeTrip',
  'dropOff.driver',
  'dropOff.myRides',
  'dropOff.bookRides'
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
  .when('/myRides', {
    templateUrl: 'rider/myRides.html',
    controller: 'myRidesCtrl'
  })
  .when('/bookRides/:tripId', {
    templateUrl: 'rider/bookRides.html',
    controller: 'bookRidesCtrl'
  })
  .otherwise({redirectTo: '/login'});
}])

.controller('appCtrl', ['$scope','$route', '$location', function ($scope, $route, $location){
    $scope.$on("$routeChangeSuccess", function (scope, next, current) {
      if ($location.path() == "/register" || $location.path() == "/login"){
        $scope.addClass = "bgImg";
      }else{
        $scope.addClass = "bgColor";
      }
    });
}]);

