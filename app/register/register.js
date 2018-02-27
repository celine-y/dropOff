'use restrict';

angular.module('dropOff.register', ['ngRoute', 'firebase'])

// .config(['$routeProvider', function($routeProvider){
// 	$routeProvider.when('/register', {
// 		templateUrl: 'register/register.html',
// 		controller: 'RegisterCtrl'
// 	});
// }])

.controller('RegisterCtrl', ['$scope', 'CommonProp', '$firebaseAuth', '$location', function($scope, CommonProp, $firebaseAuth, $location){
	// TODO: set default value to rider

	$scope.signUp = function(){
		var username = $scope.user.email;
		var password = $scope.user.password;

		if(username && password){
			var auth = $firebaseAuth();
			auth.$createUserWithEmailAndPassword(username, password)
			.then(function(user){
				var ref = firebase.database().ref().child("users");
				var data = {
					email: $scope.user.email,
					permission: $scope.user.type
				}
				ref.child(user.uid).set(data).then(function(ref) {//use 'child' and 'set' combination to save data in your own generated key
					console.log("New user created");
					// TODO: refactor so that code isn't repeated from login.js
					auth.$signInWithEmailAndPassword(username, password).then(function(response){
						console.log("User Login Successful");
						CommonProp.setUser(response);
						$location.path('/home');
					}).catch(function(error){
						$scope.errMsg = true;
						$scope.errorMessage = error.message;
					});
				}, function(error) {
					console.log(error); 
				});
			}).catch(function(error){
				$scope.errMsg = true;
				$scope.errorMessage = error.message;
			});
		}
	}

}])