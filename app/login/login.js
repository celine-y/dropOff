'use strict';

angular.module('dropOff.login', ['ngRoute', 'firebase'])

// .config(['$routeProvider', function($routeProvider){
// 	$routeProvider.when('/login', {
// 		templateUrl: 'login/login.html',
// 		controller: 'LoginCtrl'
// 	});
// }])

.controller('LoginCtrl', ['$scope', '$firebaseAuth', '$location', 'CommonProp', 'LoginFactory', function($scope, $firebaseAuth, $location, CommonProp, LoginFactory){

	$scope.username = CommonProp.getUser();

	if($scope.username){
		$location.path('/home');
	}

	$scope.signIn = function(){
		var username = $scope.user.email;
		var password = $scope.user.password;
		var auth = $firebaseAuth();

		LoginFactory.signIn(username, password)
		.catch(function(error){
			$scope.errMsg = true;
			$scope.errorMessage = error.message;
		});
	}

}])

.factory('LoginFactory', ['$location', 'CommonProp', '$firebaseAuth', '$q', '$firebaseObject', function($location, CommonProp, $firebaseAuth, $q, $firebaseObject){
	var auth = $firebaseAuth();

	return {
		signIn: function(username, password){
			var defered = $q.defer();
			auth.$signInWithEmailAndPassword(username, password)
			.then(function(response){
				console.log("Login: success");
				$location.path('/home');
				CommonProp.setUser(response);
				defered.resolve(response);
			})
			.catch(function(err){
				defered.reject(err);
			});
			return defered.promise;
		}
	}
}])

.service('CommonProp', ['$location', '$firebaseAuth', '$firebaseObject', function($location, $firebaseAuth, $firebaseObject){
	var user = "";
	var UID = "";
	var permission = "";
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
		getPermission: function(){
			// console.log(permission);
			if(permission == ""){
				if (!localStorage.getItem('permission')) {
					var ref = firebase.database().ref().child('users').child(this.getUID());
					var firebaseUser = $firebaseObject(ref);
					console.log(firebaseUser);
					console.log(firebaseUser.permission);
					localStorage.setItem('permission', firebaseUser.permission);
				}
				console.log(localStorage.getItem('permission'));
				// permission = "driver";
			}
			return permission;
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
			localStorage.removeItem('permission');
			$location.path('/home');
		}
	};
}]);