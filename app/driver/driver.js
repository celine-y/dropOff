'use strict';

angular.module('dropOff.driver', ['ngRoute', 'firebase', 'color.picker'])

.controller('driverCtrl', ['$scope', 'CommonProp', '$location', '$firebaseArray', 'seatCalc', '$firebaseObject',
    function($scope, CommonProp, $location, $firebaseArray, seatCalc, $firebaseObject){
        $scope.username = CommonProp.getUser();
        $scope.userType = CommonProp.getPermission();
        $scope.success = false;

        if(!$scope.username && $scope.userType != "driver"){
            $location.path('/login');
        }

        var uid = CommonProp.getUID();
        var driverRef = firebase.database().ref().child('drivers').child(uid);
        var driver = $firebaseObject(driverRef);
        
        driver.$bindTo($scope, "driver");

        // setup color picker
        $scope.options = {
            format: 'hex',
            hue: true,
            saturation: false,
        };
        $scope.driver = {
            color: 'FFFFFF'
        }

        $scope.getColor = function(){
            return "#"+$scope.driver.color;
        }

        $scope.updateDriver = function(){
            driver = $scope.driver;
        }

        $scope.logout = function(){
            CommonProp.logoutUser();
        };
    }
 ]);