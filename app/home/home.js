'use strict';

angular.module('dropOff.home', ['firebase', 'angularjs-datetime-picker'])

.controller('HomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location', '$filter',
 function($scope, CommonProp, $firebaseArray, $firebaseObject, $location, $filter){
	$scope.username = CommonProp.getUser();
	$scope.userType = CommonProp.getPermission();

	if(!$scope.username){
		$location.path('/login');
	}

	if($scope.userType == "driver"){
		var uid = CommonProp.getUID();
		var today = moment().startOf('day');

		var driverTripsRef = firebase.database().ref().child('trips').orderByChild('driver').equalTo(uid);
		$scope.trips = $firebaseArray(driverTripsRef);
		
		$scope.trips.$loaded()
		.then(function() {
			$scope.dTrips = $scope.trips;
			angular.forEach($scope.dTrips, function(trip, index){
				// remove trips that are before today
				var tripdate = moment(trip.datetime);
				if (tripdate < today){
					$scope.dTrips.splice(index, 1);
				} else {
					trip['seatsLeft'] = getSeats(trip);
				}
			});
		});
	} else {
		var locationRef = firebase.database().ref().child('locations');
		$scope.locations = $firebaseArray(locationRef);

		$scope.search = {};
	}

	function getSeats(trip){
		var seatsLeft = 0;
		angular.forEach(trip.seats, function(value, key){
			if (!value.takenBy){
				seatsLeft++;
			}
		});
		return seatsLeft;
	}

	function addTrip(trip){
		var seatsLeft = getSeats(trip);
		if (seatsLeft){
			// find the driver profile
			var driverProfileRef = firebase.database().ref()
			.child('drivers')
			.child(trip.driver);
			
			var driver = $firebaseObject(driverProfileRef);
			driver.$loaded().then(function(){
				trip['driver'] = {
					color: "#"+driver.color,
					brand: driver.brand
				};
				trip['seatsLeft'] = seatsLeft;
				// add trip into list
				$scope.rTrips.push(trip);
			});
		}
	}

	$scope.searchTrip = function(){
		var searchDateStart = moment($scope.search.datetime, 'MMM DD yyyy').startOf('day').valueOf();
		var searchDateEnd = moment($scope.search.datetime, 'MMM DD yyyy').endOf('day').valueOf();
		
		var tripRef = firebase.database().ref().child('trips')
			.orderByChild('datetime')
			.startAt(searchDateStart)
			.endAt(searchDateEnd);
		$scope.trips = $firebaseArray(tripRef);

		$scope.trips.$loaded()
		.then(function() {
			var maxPrice = $scope.search.maxPrice;

			$scope.rTrips = [];
			angular.forEach($scope.trips, function(trip, index){
				// look for trips that start/end in searched destinations
				if (trip.startLoc === $scope.search.startLoc && trip.endLoc === $scope.search.endLoc){
					if (maxPrice){
						// remove trips with price greater than specified
						if (trip.price <= maxPrice){
							addTrip(trip);
						}
					} else {
						addTrip(trip);
					}
				}
			});
		});
	}

	$scope.logout = function(){
		CommonProp.logoutUser();
	};
}])