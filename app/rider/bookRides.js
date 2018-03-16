'use strict';

angular.module('dropOff.bookRides', ['ngRoute', 'firebase','ui.bootstrap'])

.controller('bookRidesCtrl', ['$scope', 'CommonProp', '$location', '$firebaseArray', '$firebaseObject','$routeParams',
	function($scope, CommonProp, $location, $firebaseArray, $firebaseObject, $routeParams){
		$scope.username = CommonProp.getUser();
		$scope.userType = CommonProp.getPermission();
		$scope.success = false;

		var tripId = $routeParams.tripId;
		var driverId = '';
		//[{col: 1, row: 1}, {col: 2, row: 2}]
		var selectedSeats = [];

		//Trip Info
		var fbRefTrip = firebase.database().ref().child('trips').child(tripId);
		var trip = $firebaseObject(fbRefTrip);
		$scope.trip = trip;
		console.log(trip);

		//User Trips
		$scope.userTrip = {};
		var fbRefUserTrip = firebase.database().ref().child('userTrips');
		$scope.userTrips = $firebaseArray(fbRefUserTrip); 

		$scope.trip.$loaded().then(function(){
			//Driver Info
			driverId = $scope.trip.driver;
			var fbRefDriver = firebase.database().ref().child('drivers').child(driverId);
			var driver = $firebaseObject(fbRefDriver);
			$scope.numSeats = 0;
			$scope.driver = driver;
			console.log($scope.driver);

			//Seat Info
			//alter $scope.seat based on seat info
			angular.forEach($scope.trip.seats, function(obj, idx){
				var row = obj.row-1;
				var col = obj.col-1;	
				var status = false;

				if (obj.takenBy){
					status = false;
				}else{
					status = true;	
				}

				$scope.seats[row][col]["isSeat"] = status;
			});

			$scope.getColor = function(){
				return "#"+$scope.driver.color;
			};

			$scope.getPrice = function(){
				return $scope.trip.price * $scope.numSeats;
			};


		});

		$scope.clickSeat = function(seat){
			if (seat.isSeat){
				if (seat.isAvailable){
					seat.isAvailable = false;
					$scope.numSeats--;
					updateSelectedSeats('remove', seat.row, seat.col);
				}else{
					seat.isAvailable = true;
					$scope.numSeats++;
					updateSelectedSeats('add', seat.row, seat.col);
				}					
			}
		};

		$scope.clickPay = function(){
			//add to userTrip
			$scope.userTrip.userId = $scope.username;
			$scope.userTrip.tripId = tripId;
			$scope.userTrips.$add(
				$scope.userTrip
				).then(function(success){
					showSuccess();
				});

			//add username to takenBy
			angular.forEach(selectedSeats, function(obj, key){
				var fbRefSeats = firebase.database().ref().child('trips').child(tripId).child("seats").orderByChild("row").equalTo(obj.row);
				fbRefSeats.on('value', function(snapshot){
					snapshot.forEach(function(item){
						if (item.val().col == obj.col){
							item.ref.update({takenBy: $scope.username});
						};						
					});
				});
			});
		};

		function showSuccess(){
			$scope.success = true;
			window.setTimeout(function(){
				$scope.$apply(function(){
					$scope.success = false;
				});
			}, 2000);
		}

		function updateSelectedSeats(action, row, col){
			if (action == "add"){
				selectedSeats.push({row: row, col: col});
			}else{ //remove
				angular.forEach(selectedSeats, function(obj,key){
					if(obj.row == row && obj.col == col){
						selectedSeats.splice(key,1);
					}
				});
			}
		}

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
