'use strict';

angular.module('dropOff.login', ['ngRoute', 'firebase'])

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

	$scope.setBackground = function (){
		console.log("load background");
		return {
            'background-image':'url(style/bg4.jpg)'
            // 'background-color': 'red'
        }
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
				CommonProp.setUser(response);
				CommonProp.setPermission(response.uid)
				.then(function(){
					$location.path('/home');
				});
				defered.resolve(response);
			})
			.catch(function(err){
				defered.reject(err);
			});
			return defered.promise;
		}
	}
}])

.service('CommonProp', ['$location', '$firebaseAuth', '$firebaseObject', '$q', function($location, $firebaseAuth, $firebaseObject, $q){
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
		setPermission: function(uid){
			var defer = $q.defer();

			var ref = firebase.database().ref().child('users').child(uid);
			$firebaseObject(ref).$loaded()
			.then(function(ref){
				localStorage.setItem('permission', ref.permission);
				permission = ref.permission;
				defer.resolve(permission);
			})
			.catch(function(err){
				defer.reject(err);
			});

			return defer.promise;
		},
		getPermission: function(){
			if(permission == ""){
				permission = localStorage.getItem('permission');
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
			UID = "";
			permission = "";
			localStorage.removeItem('userEmail');
			localStorage.removeItem('uid');
			localStorage.removeItem('permission');
			$location.path('/home');
		}
	};
}]);