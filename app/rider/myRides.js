'use strict';

angular.module('dropOff.myRides', ['ngRoute', 'firebase','ui.bootstrap'])

.controller('myRidesCtrl', ['$scope', 'CommonProp', '$location', '$firebaseArray', '$firebaseObject',
    function($scope, CommonProp, $location, $firebaseArray, $firebaseObject){
        $scope.username = CommonProp.getUser();
        $scope.userType = CommonProp.getPermission();
        $scope.success = false;
        var mySeats = [];

        if(!$scope.username && $scope.userType != "rider"){
            $location.path('/login');
        }

        $scope.uid = CommonProp.getUID();

        var userTripRef = firebase.database().ref().child('userTrips').orderByChild('userId').equalTo($scope.uid);
        $scope.userTrips = $firebaseArray(userTripRef);
        $scope.trips = [];
        $scope.drivers = [];
        var today = moment().startOf('day');

        $scope.userTrips.$loaded()
        .then(function(){
            angular.forEach($scope.userTrips, function (obj, index){
                var tripRef = firebase.database().ref().child('trips').child(obj.tripId);
                var singleTrip = $firebaseObject(tripRef);
                
                singleTrip.$loaded().then(function(){
                    var tripdate = moment(singleTrip.datetime);
                    //get trip information that are after today
                    if (tripdate >= today){
                        $scope.trips.push(singleTrip); 
                        //try pushing drivers in here
                        var driverRef = firebase.database().ref().child('drivers').child(singleTrip.driver);
                        var driver = $firebaseObject(driverRef);
                        $scope.drivers.push(driver);
                    }
                });
            });
        });

        function seatDesc(row, col){
            var desc='';
            if (row==1){
                desc = 'Front ';
            }else{
                desc = 'Back ';
            }

            if (col==1){
                desc += 'left';
            }else if (col==2 && row==1){
                desc += 'right';
            }else if (col==2 && row==2){
                desc += 'middle';
            }else if (col==3){
                desc += 'right';
            }
            return desc;
        }

        $scope.getDriverInfo = function(dId){
            var carInfo = '';
            angular.forEach($scope.drivers, function(obj, idx){             
                if (obj.$id == dId){
                    carInfo = obj.brand+" | "+obj.license;
                }
            });
            return carInfo; 
        }  

        $scope.getCarColor = function (dId){
            var carColor = '';
            angular.forEach($scope.drivers, function(obj, idx){             
                if (obj.$id == dId){
                    carColor= obj.color;
                }
            });
            return "#"+carColor; 
        }

        $scope.getSeat = function(seats){
            $scope.seating = [];
            $scope.numSeats = 0;
            angular.forEach(seats, function(obj, idx){
                if (obj.takenBy == $scope.uid){
                    $scope.numSeats++;
                    $scope.seating.push(seatDesc(obj.row, obj.col));
                }
            });
            return $scope.seating.join(", ");
        }

        $scope.logout = function(){
            CommonProp.logoutUser();
        };


    }
    ]);
