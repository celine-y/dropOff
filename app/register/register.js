'use restrict';

angular.module('dropOff.register', ['ngRoute', 'firebase'])

// .config(['$routeProvider', function($routeProvider){
// 	$routeProvider.when('/register', {
// 		templateUrl: 'register/register.html',
// 		controller: 'RegisterCtrl'
// 	});
// }])

.controller('RegisterCtrl', ['$scope', 'CommonProp', '$firebaseAuth', '$location', 'LoginFactory', function($scope, CommonProp, $firebaseAuth, $location, LoginFactory){
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
				// save user to own database so additional data can be saved
				ref.child(user.uid).set(data).then(function(ref) {
					console.log("Success: new user created");
					// signin new user
					LoginFactory.signIn(username, password)
					.catch(function(error){
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