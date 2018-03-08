'use strict';

angular.module('dropOff.home', ['firebase'])

.controller('HomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location', function($scope, CommonProp, $firebaseArray, $firebaseObject, $location){
	$scope.username = CommonProp.getUser();
	$scope.userType = CommonProp.getPermission();

	if(!$scope.username){
		$location.path('/login');
	}

	if($scope.userType == "driver"){
		
	} else {

	}


	$scope.logout = function(){
		CommonProp.logoutUser();
	};

	$scope.newTrip = function(){
		$location.path('/makeTrip');
	}
}])