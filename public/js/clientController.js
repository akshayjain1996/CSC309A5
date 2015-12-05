var app = angular.module('a4', ['ngRoute','ngResource']);

app.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode({
  enabled: true,
  requireBase: false
}).hashPrefix('!');
}]);

// App Routing
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider	

		.when('/', {
			templateUrl: 'partials/login.html',
			controller: 'LoginCtl'
		})

		.when('/signup', {
			templateUrl: 'partials/signup.html',
			controller: 'SignupCtl'
		})
		/*
		.when('/allCaterers', {
			templateUrl: 'partials/allCaterers.html',
			controller: 'allCaters'	
		})
		*/
		.when('/profile', {
			templateUrl: 'partials/profile.html',
			controller: 'ProfileCtl'
		})

		.when('/track', {
			templateUrl: 'partials/track.html',
			controller: 'TrackCtl'
		})

		.when('/caterers', {
			templateUrl: 'partials/allCaterers.html',
			controller: 'allCaters'
		})

		.when('/editUser', {
			templateUrl: 'partials/editUser.html',
			controller: 'EditCtl'
		});

		.when('/userdash', {
			templateUrl: 'partials/user_dashboard.html', 
			controller: 'user-dash'
		});

	$locationProvider.html5Mode(true);

}]);

//Controller for the Header
app.controller('MainCtl', function($scope, $http, $location, $route, userFactory) {
	
	$scope.goHome = function(){
		if(userFactory.getUser()) {
			$location.path('/allCaterers');
		} else {
			$location.path('/');
		}
	}

	$scope.logout = function(){
		$http.post('logout', {}).success(function (response){
			userFactory.setUser(null);
			$location.path('/');
		});
	}

});

//Controller for login page
app.controller('LoginCtl', function($scope, $http, $location, $route, $window, userFactory) {

	$scope.login = function() {
		console.log($scope.username);
		$http.post('login', {username: $scope.username, password: $scope.password}).success(function (response){
			if(response.sucess == 'true'){
				userFactory.setUser(JSON.parse(response.user));
				$location.path('/caterers');

			} else {
				$window.alert("Invalid Login/Password");
			}
		});
	}

	$scope.signup = function() {
		$location.path('/signup');
	}

});

//controller for Signup page
app.controller('SignupCtl', function($scope, $http, $location, $window, userFactory) {

	$scope.submit = function() {

		if($scope.password != $scope.repassword){
			alert("Passwords mismatch. Please try again."); 
		} else {

			$http.post('/signup', 
				{displayname: $scope.displayname, username: $scope.username, password: $scope.password})
			.success(function(response) {
				if(response.sucess == 'true'){
					userFactory.setUser(JSON.parse(response.user));
					$location.path('/caterers');
				} else {
					document.getElementById("message").innerHTML = response.message;
				}
			});
		}
	}

});

//Controller for page that displays all users
app.controller('AllUsersCtl', function($scope, $http, $location, userFactory,selectedFactory) {

	$http.post('tracker', {page : "allusers"}).success(function (response){
		console.log("return ngResource")
		var u = userFactory.getUser();
		u.alluserPage = u.alluserPage + 1;
		userFactory.setUser(u);
	});

	var user = userFactory.getUser();

	if(!userFactory.getUser()) {
		$location.path('/');
	} else if(user.permission == "0"){
		document.getElementById("welcome").innerHTML = 'Welcome Super User';
	} else if(user.permission == "1"){
		document.getElementById("welcome").innerHTML = 'Welcome Administrator';
	} else {
		document.getElementById("welcome").innerHTML = 'Welcome User';
	}

	$http.get('userlist').success(function(response) {
		console.log(response.userList);
		$scope.users = response.userList;
	});

	$scope.profileHandle = function(){
		selectedFactory.setUser(user);
		$location.path('/profile');
	}

	$scope.userClick = function(selectedUser){
		selectedFactory.setUser(selectedUser);
		$location.path('/profile');
	}

});

//Controller for Edit page
app.controller('EditCtl', function($scope, $http, $location, $window, userFactory, selectedFactory) {
	$http.post('tracker', {page : "edituser"}).success(function (response){
		var u = userFactory.getUser();
		u.editPage = u.editPage + 1;
		userFactory.setUser(u);
	});
	var user = userFactory.getUser();
	var selectedUser = selectedFactory.getUser();

	if(!userFactory.getUser()) {
		$location.path('/');
	} 

	if(!(selectedUser)){
		$location.path('/');	
	}

	$scope.username = selectedUser.username;
	$scope.displayname = selectedUser.displayname;
	$scope.description = selectedUser.description;

	$scope.editProfile = function() {
		if($scope.description.length > 500){
			$window.alert("Description cannoot be longer than 500 characters");
		} else {
			selectedUser.displayname = $scope.displayname ;
			selectedUser.description = $scope.description;

			$http.post('editProfile', {user: JSON.stringify(selectedUser)}).success(function (response){
				if(response.message == "success"){
					$location.path('/profile');
				} else {
					$window.alert(response.message);
				}
			});
		}
	}

	$scope.uploadPic = function(files){
		 var fd = new FormData();
	    //Take the first selected file
	    fd.append("file", files[0]);

	    $http.post('uploadPic', fd, {withCredentials: true, headers: {'Content-Type': undefined },
	    	transformRequest: angular.identity})
	    .success(function (response){
	    	console.log("Success");  
	    });
	}

	$scope.changePassword = function() {
		if($scope.oldPassword != user.password){
			$window.alert("Incorrect old password");
		} else if($scope.newPassword != $scope.rePassword){
			$window.alert("Passwords dont match");
		} else {
			user.password = $scope.newPassword;
			$http.post('updatePassword', {user: JSON.stringify(selectedUser)}).success(function (response){
				if(response.message == "success"){
					$location.path('/profile');
				} else {
					$window.alert(response.message);
				}
			});
		}
	}

	$scope.backHandle = function(){
		$location.path('/profile');
	}

});


//Controller for Profile page
app.controller('ProfileCtl', function($scope, $http, $location, $window, userFactory, selectedFactory) {

	$http.post('tracker', {page : "profile"}).success(function (response){
		var u = userFactory.getUser();
		u.profilePage = u.profilePage + 1;
		userFactory.setUser(u);
	});

	var user = userFactory.getUser();
	var selectedUser = selectedFactory.getUser();

	if(!userFactory.getUser()) {
		$location.path('/');
	} 

	if(!(selectedUser)){
		$location.path('/');	
	}

	$scope.username = selectedUser.username;
	$scope.displayname = selectedUser.displayname;
	$scope.description = selectedUser.description;

	if((user.username == selectedUser.username) || ((selectedUser.permission == 2) && (user.permission < 2))) {
		document.getElementById('editButton').style.visibility = "visible";
	} else {
		document.getElementById('editButton').style.visibility = "hidden";
	}

	if(user.permission == 0){
		if(selectedUser.permission == 2){
			document.getElementById('removeAdminButton').style.visibility = "hidden";
			document.getElementById('makeAdminButton').style.visibility = "visible";
		} else {
			document.getElementById('removeAdminButton').style.visibility = "visible";
			document.getElementById('makeAdminButton').style.visibility = "hidden";
		}
		document.getElementById('trackButton').style.visibility = "visible";
		document.getElementById('deleteButton').style.visibility = "visible";
	} else if(user.permission == 1){
		document.getElementById('removeAdminButton').style.visibility = "hidden";
		document.getElementById('makeAdminButton').style.visibility = "hidden";
		document.getElementById('trackButton').style.visibility = "visible";
		if(selectedUser.permission == 2){
			document.getElementById('deleteButton').style.visibility = "visible";
		} else{
			document.getElementById('deleteButton').style.visibility = "hidden";
		}
	} else {
		document.getElementById('removeAdminButton').style.visibility = "hidden";
		document.getElementById('makeAdminButton').style.visibility = "hidden";
		document.getElementById('deleteButton').style.visibility = "hidden";
		document.getElementById('trackButton').style.visibility = "hidden";
	}

	$scope.editHandle = function(){
		$location.path('/editUser');
	}

	$scope.backHandle = function(){
		$location.path('/allusers');
	}

	$scope.makeAdmin = function(){
		$http.post('makeAdmin', {user: JSON.stringify(selectedUser)}).success(function (response){
			if(response.message == "success"){
				$window.alert("This user is now an admin");
				document.getElementById('removeAdminButton').style.visibility = "visible";
				document.getElementById('makeAdminButton').style.visibility = "hidden";
			} else {
				$window.alert(response.message);
			}
		});
	}

	$scope.removeAdmin = function(){
		$http.post('removeAdmin', {user: JSON.stringify(selectedUser)}).success(function (response){
			if(response.message == "success"){
				$window.alert("This user has been removed from admin");
				document.getElementById('removeAdminButton').style.visibility = "hidden";
				document.getElementById('makeAdminButton').style.visibility = "visible";
			} else {
				$window.alert(response.message);
			}
		});	
	}

	$scope.deleteUser = function() {
		$http.post('deleteUser', {user: JSON.stringify(selectedUser)}).success(function (response){
			if(response.message == "success"){
				$window.alert("Uesr Deleted");
				$location.path('/allusers');
			} else {
				$window.alert(response.message);
			}
		});
	}

	$scope.trackUser = function(){
		$location.path('/track');
	}

});

app.controller('allCaters', function($scope, $http,  $location, $window, userFactory){

	var refresh = function(){
		$http.get('/caterers').success(function(response){
			$scope.caterers = response; 
		}); 
	}

	refresh(); 

	$scope.view = function(id_caterer){
		$http.get("/caterer/" + id_caterer).success(function(response){
		//TODO get the details of this particular caterer from the server
		});
	}

	$scope.profile = function(){

	}

	$scope.dashboard = function(){
		if(userFactory.getUser.type != 1){
			http.post('makeCaterer', {user: JSON.stringify(userFactory.getUser)}).success(function(response) {
				if(response.sucess = 'true'){
					$window.alert("you are now registered as a caterer");
					userFactory.setUser(JSON.parse(response.user));

				}else {
					$window.alert("somethings not right");
				}
			});
		}

	}
});

app.controller('user-dash', function($scope, $http,  $location, $window, userFactory){

	var refresh = function(){
		$http.get('/users').success(function(response){
			$scope.users = users; 
		}); 
	}

	refresh(); 

});

//Factory : stores the user currently logged in
app.factory('userFactory', function(){
	var userFactory = {};
	var user = null;

	userFactory.setUser = function(usr) {
		user = usr;
	};

	userFactory.getUser = function(usr) {
		return user;
	}

	return userFactory;
});


