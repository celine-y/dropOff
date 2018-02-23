'use strict';

angular.module('dropOff.login', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/login', {
		templateUrl: 'login/login.html',
		controller: 'LoginCtrl'
	});
}])

.controller('LoginCtrl', ['$scope', '$firebaseAuth', '$location', 'CommonProp', function($scope, $firebaseAuth, $location, CommonProp){

	$scope.username = CommonProp.getUser();

	if($scope.username){
		$location.path('/home');
	}

	$scope.signIn = function(){
		var username = $scope.user.email;
		var password = $scope.user.password;
		var auth = $firebaseAuth();

		auth.$signInWithEmailAndPassword(username, password).then(function(response){
			console.log("User Login Successful");
			CommonProp.setUser(response);
			$location.path('/home');
		}).catch(function(error){
			$scope.errMsg = true;
			$scope.errorMessage = error.message;
		});
	}

}])

.service('CommonProp', ['$location', '$firebaseAuth', function($location, $firebaseAuth){
	var user = "";
	var UID = "";
	var auth = $firebaseAuth();

	return {
		getUser: function(){
			if(user == ""){
				user = localStorage.getItem('userEmail');
			}
			return user;
		},
		getUID: function(){
			if(UID == ""){
				UID = localStorage.getItem('uid');
			}
			return UID;
		},
		setUser: function(loggedInUser){
			localStorage.setItem('userEmail', loggedInUser.email);
			localStorage.setItem('uid', loggedInUser.uid);
			user = loggedInUser.email;
			UID = loggedInUser.uid;
		},
		logoutUser: function(){
			auth.$signOut();
			console.log("Logged Out Succesfully");
			user = "";
			localStorage.removeItem('userEmail');
			localStorage.removeItem('uid');
			$location.path('/home');
		}
	};
}]);