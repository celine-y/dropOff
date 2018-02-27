'use strict';

angular.module('dropOff.home', ['ngRoute', 'firebase'])

// .config(['$routeProvider', function($routeProvider){
// 	$routeProvider.when('/home',{
// 		templateUrl: 'home/home.html',
// 		controller: 'HomeCtrl'
// 	});
// }])

.controller('HomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location', function($scope, CommonProp, $firebaseArray, $firebaseObject, $location){
	$scope.username = CommonProp.getUser();
	$scope.userType = CommonProp.getPermission();

	if(!$scope.username){
		$location.path('/login');
	}

	$scope.logout = function(){
		CommonProp.logoutUser();
	};
}])