'use strict';

angular.module('dropOff.bookRides', ['ngRoute', 'firebase','ui.bootstrap'])

.controller('bookRidesCtrl', ['$scope', 'CommonProp', '$location', '$firebaseArray', '$firebaseObject','$routeParams',
	function($scope, CommonProp, $location, $firebaseArray, $firebaseObject, $routeParams){
		$scope.username = CommonProp.getUser();
		$scope.userType = CommonProp.getPermission();
		// $scope.success = false;

		var tripId = $routeParams.tripId;
		var driverId = '';
		//Trip Info
		var fbRefTrip = firebase.database().ref().child('trips').child(tripId);
		var trip = $firebaseObject(fbRefTrip);
		trip.$bindTo($scope, "trip");

		$scope.getDriver = function(){
			driverId = $scope.trip.driver;
		}

	}
]);
