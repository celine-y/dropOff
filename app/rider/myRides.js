'use strict';

angular.module('dropOff.myRides', ['ngRoute', 'firebase'])

.controller('myRidesCtrl', ['$scope', 'CommonProp', '$location', '$firebaseArray', '$firebaseObject',
    function($scope, CommonProp, $location, $firebaseArray, $firebaseObject){
        $scope.username = CommonProp.getUser();
        $scope.userType = CommonProp.getPermission();
        $scope.success = false;

        if(!$scope.username && $scope.userType != "rider"){
            $location.path('/login');
        }

        var uid = CommonProp.getUID();
    }
 ]);