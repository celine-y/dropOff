'use strict';

angular.module('dropOff.myRides', ['ngRoute', 'firebase'])

.controller('myRidesCtrl', ['$scope', 'CommonProp', '$location', '$firebaseArray', '$firebaseObject',
    function($scope, CommonProp, $location, $firebaseArray, $firebaseObject){
        $scope.username = CommonProp.getUser();
        $scope.userType = CommonProp.getPermission();
        $scope.success = false;
        $scope.seating = '';
        var mySeats = [];

        if(!$scope.username && $scope.userType != "rider"){
            $location.path('/login');
        }

        var uid = CommonProp.getUID();

        //get userTrips
        var userTripRef = firebase.database().ref().child('userTrips').orderByChild('userId').equalTo(uid);
        $scope.userTrips = $firebaseArray(userTripRef);
        $scope.trips = [];
        var today = moment().startOf('day');

        $scope.userTrips.$loaded()
        .then(function(){
            angular.forEach($scope.userTrips, function (obj, index){
                //get trip information that are after today
                var tripRef = firebase.database().ref().child('trips').child(obj.tripId);
                var singleTrip = $firebaseObject(tripRef);
                
                singleTrip.$loaded().then(function(){
                    var tripdate = moment(singleTrip.datetime);
                    if (tripdate >= today){
                        $scope.trips.push(singleTrip); 
                    }
                });

            });
        });


        function seatDesc(col, row){
            if (row==1){
                $scope.seating = 'Front ';
            }else{
                $scope.seating = 'Back ';
            }

            if (col==1){
                $scope.seating += ' left';
            }else if (col==2 && row==1){
                $scope.seating += ' right';
            }else if (col==2 && row==2){
                $scope.seating += ' middle';
            }else if (col==3){
                $scope.seating += ' right';
            }
        }

        $scope.logout = function(){
            CommonProp.logoutUser();
        };


    }
    ]);
