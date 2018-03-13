'use strict';

angular.module('dropOff.bookRide', ['ngRoute', 'firebase'])

.controller('bookRideCtrl', ['$scope', 'CommonProp','$firebaseArray', '$firebaseObject', function($scope, CommonProp, $firebaseArray, $firebaseObject){
	$scope.username = CommonProp.getUser();
	$scope.userType = CommonProp.getPermission();

	var tripId = 'L7BXixprdeTUDCdbOOG';
	// var tripRef = firebase.database().ref().child('trips').child('tripId');
	var tripRef = firebase.database().ref('dropoff-mscci444/trips/'+tripId);
	$scope.trips = $firebaseArray(tripRef);
	$scope.trips.$loaded();
}])