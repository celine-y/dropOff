'use strict';

angular.module('dropOff.makeTrip', ['ngRoute', 'firebase', 'ngSanitize', 'ui.select'])

.controller('makeTripCtrl', ['$scope', 'CommonProp', '$location', '$firebaseArray', 'seatCalc', '$firebaseObject',
 function($scope, CommonProp, $location, $firebaseArray, seatCalc, $firebaseObject){
    $scope.username = CommonProp.getUser();
    $scope.userType = CommonProp.getPermission();
    $scope.success = false;
    $scope.hasProfile = true;

    if(!$scope.username && $scope.userType != "driver"){
        $location.path('/login');
    }

    var uid = CommonProp.getUID();
    var driverRef = firebase.database().ref('drivers');
    driverRef.once("value")
    .then(function(snapshot) {
      $scope.hasProfile = snapshot.hasChild(uid); // true
    });


    var locationRef = firebase.database().ref().child('locations');
    $scope.locations = $firebaseArray(locationRef);

    $scope.tagTransform = function(newTag){
      console.log(newTag);
      var item = {
        name: newTag
      };
      return item;
    }

    $scope.trip = {};
    var tripRef = firebase.database().ref().child('trips');
    $scope.trips = $firebaseArray(tripRef);

    $scope.createTrip = function(){
      $scope.trip.seats = seatCalc.getTripSeats($scope.seats);
      $scope.trip.driver = CommonProp.getUID();

      $scope.trip.datetime = moment($scope.datetime, "MMM DD yyyy HH:mm").valueOf();
      $scope.trips.$add(
        $scope.trip
      ).then(function(ref){
        showSuccess();
      }, function(error){
        console.log(error);
      });
    }

    function showSuccess(){
      $scope.success = true;
			window.setTimeout(function(){
				$scope.$apply(function(){
          $scope.success = false;
				});
			}, 2000);
    }

    // *********** SKETCHY WAY OF ADDING DATA FOR NOW
    // var locations = ["Waterloo", "London", "Kingston"];

    // for(var i = 0; i < locations.length; i++){
    //     $scope.locations.$add({
    //         name: locations[i]
    //     }
    //     ).then(function(ref){
    //         console.log(ref);
    //     }, function(error){
    //         console.log(error);
    //     });
    // }

    // var times = ["Early Morning", "Mid-morning", "Afternoon", "Evening", "Late Night"];
    // for(var i = 0; i < times.length; i++){
    //     $scope.times.$add({
    //         description: times[i]
    //     });
    // }
    // ***********************END SKETCHY
    
    $scope.obj = [
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
        isSeat: true,
        takenBy: false
      }],
      [{
        col: 1,
        row: 2,
        isAvailable: false,
        isSeat: true,
        takenBy: false
      }, {
        col: 2,
        row: 2,
        isAvailable: false,
        isSeat: true,
        takenBy: false
      }, {
        col: 3,
        row: 2,
        isAvailable: false,
        isSeat: true,
        takenBy: false
      }]
    ];
    $scope.isDisabled = false;
    $scope.seats = $scope.obj;
    // $scope.rowLetter = seatCalc.rowStack($scope.obj);
    // $scope.seatCount = 0;
    
    $scope.clickSeat = function(seat) {
      if (seat.isSeat && !$scope.isDisabled) {
        if (seat.isAvailable) {
          seat.isAvailable = false;
          // $scope.seatCount--;
        } else {
          seat.isAvailable = true;
          // $scope.seatCount++;
        }
      }
    }
}])
  
.service('seatCalc', function() {
    var rowLetter = [];

    this.rowStack = function(obj) {
      for (var i = 0, j = 65; i < obj.length; i++, j++) {
      rowLetter.push(String.fromCharCode(j));
      }
      return rowLetter;
    }

    this.getTripSeats = function(seats) {
      var tripSeats = [];

      for (var row = 0; row < seats.length; row++){
        for (var col = 0; col < seats[row].length; col++){
          var currentSeat = seats[row][col];
          if (currentSeat.isSeat && currentSeat.isAvailable){
            tripSeats.push(currentSeat);
          }
        }
      }

      return tripSeats;
    }
});