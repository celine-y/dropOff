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
		$scope.trip = trip;
		console.log($scope.trip);

		//User Trips
		$scope.userTrip = {};
		var fbRefUserTrip = '';

		$scope.trip.$loaded().then(function(){
			//Driver Info
			driverId = $scope.trip.driver;
			var fbRefDriver = firebase.database().ref().child('drivers').child(driverId);
			var driver = $firebaseObject(fbRefDriver);
			$scope.driver = driver;
			console.log($scope.driver);

			//Seat Info
			//alter $scope.seat based on seat info
			angular.forEach($scope.trip.seats, function(obj, idx){
				var row = obj.row-1;
				var col = obj.col-1;
				var status = obj.isAvailable;

				$scope.seats[row][col]["isSeat"] = status;
			});

			$scope.getColor = function(){
				return "#"+$scope.driver.color;
			};

			$scope.clickSeat = function(seat){
				if (seat.isSeat){
					if (seat.isAvailable){
						seat.isAvailable = false;
					}else{
						seat.isAvailable = true;
					}					
				}
			};

			$scope.clickConfirm = function (){
				var user
			};


		});

		$scope.seats = [
		[{
			col: 1,
			row: 1,
			isAvailable: false,
			isSeat: false,
			takenBy: false
		}, {
			col: 2,
			row: 1,
			isAvailable: false,
			isSeat: false,
			takenBy: false
		}],
		[{
			col: 1,
			row: 2,
			isAvailable: false,
			isSeat: false,
			takenBy: false
		}, {
			col: 2,
			row: 2,
			isAvailable: false,
			isSeat: false,
			takenBy: false
		}, {
			col: 3,
			row: 2,
			isAvailable: false,
			isSeat: false,
			takenBy: false
		}]
		];


	}
	]);
