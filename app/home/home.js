'use strict';

angular.module('dropOff.home', ['firebase', 'angularjs-datetime-picker'])

.controller('HomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location', function($scope, CommonProp, $firebaseArray, $firebaseObject, $location){
	$scope.username = CommonProp.getUser();
	$scope.userType = CommonProp.getPermission();

	if(!$scope.username){
		$location.path('/login');
	}

	if($scope.userType == "driver"){
		var uid = CommonProp.getUID();
		var today = new Date().setHours(0,0,0,0);
		var driverTripsRef = firebase.database().ref().child('trips').orderByChild('driver').equalTo(uid);
		$scope.trips = $firebaseArray(driverTripsRef);
		
		$scope.trips.$loaded()
		.then(function() {
			$scope.dTrips = $scope.trips;
			angular.forEach($scope.dTrips, function(trip, index){
				// remove trips that are before today
				if (trip.datetime < today.valueOf()){
					$scope.dTrips.splice(index, 1);
				} else {
					// count the number of seats left
					var seatsLeft = 0;
					angular.forEach(trip.seats, function(value, key){
						if (!value.takenBy){
							seatsLeft++;
						}
					});
					trip['seatsLeft'] = seatsLeft;
				}
			});
		});
	} else {

	}


	$scope.logout = function(){
		CommonProp.logoutUser();
	};

	$scope.newTrip = function(){
		$location.path('/makeTrip');
	}
}])