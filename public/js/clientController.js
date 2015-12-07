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
		.when('/*', {
			templateUrl: 'partials/forbidden.html',
			controller: 'forbidden'
		})
		
		.when('/', {
			templateUrl: 'partials/login.html',
			controller: 'LoginCtl'
		})

		.when('/signup', {
			templateUrl: 'partials/signup.html',
			controller: 'SignupCtl'
		})
	
		.when('/allCaterers', {
			templateUrl: 'partials/allCaterers.html',
			controller: 'allCaters'	
		})
	
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
			templateUrl: 'partials/updateUser.html',
			controller: 'userEdit'
		})

		.when('/editCaterer', {
			templateUrl: 'partials/updateCaterer.html',
			controller: 'catererEdit'
		})

		.when('/catererDash', {
			templateUrl: 'partials/catererDashboard.html', 
			controller: 'catererDashboard'
		})

		.when('/catererDisplay', {
			templateUrl: 'partials/catererDisplay.html',
			controller: 'catererDisplay'
		})

		.when('/order', {
			templateUrl: 'partials/order.html',
			controller: 'orderController'
		})

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

//Controller for forbidden
app.controller('forbidden', function($scope, $http, $location, $route, $window, userFactory) {
	$location.path('/forbidden');
});

//Controller for login page
app.controller('LoginCtl', function($scope, $http, $location, $route, $window, userFactory) {

	$scope.login = function() {
		console.log($scope.username);
		$http.post('/login', {username: $scope.username, password: $scope.password}).success(function (response){
			if(response.sucess == 'true'){
				console.log(response.user);
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
	
	//if already logged in, go to main page
	$http.post('/loggedincheck', {}).success(function (response){
			if(response.sucess == 'true'){
				$location.path('/caterers');

			} else {
			}
		});

});

//controller for Signup page
app.controller('SignupCtl', function($scope, $http, $location, $window, userFactory) {

	$scope.back = function(){
		$location.path('/');
	}

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
app.controller('AllUsersCtl', function($scope, $http, $location, userFactory) {

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

	var usr = userFactory.getUser();

	var refresh = function(){
		$http.get('/reqcaterers').success(function(response){
			console.log(response.caterers);
			$scope.caterers = JSON.parse(response.caterers);
		}); 
	}

	refresh(); 

	$scope.view = function(id_caterer, caterer){
		console.log(id_caterer); 
		console.log(caterer); 
		userFactory.setCaterer(caterer); 
		$location.path('/catererDisplay'); 
	};

	$scope.profile = function(){
		console.log(usr); 
		if(usr.type == 1){
			$location.path('/editUser');
		}else if(usr.type == 2){
			$location.path('/editCaterer'); 
		}
	};

	$scope.dashboard = function(){
		if(usr.type == 1){
			$http.post('makeCaterer', {user: JSON.stringify(usr)}).success(function (response){
				if(response.sucess = 'true'){
					$window.alert("you are now registered as a caterer");
					userFactory.setUser(JSON.parse(response.user));
					console.log(JSON.parse(response.user));
					$location.path('/catererDash');

				}else {
					$window.alert("somethings not right");
				}
			});
		} else {
			$location.path('/catererDash');
		}

	};
});

app.controller('userEdit', function($scope, $http,  $location, $window, userFactory){
	var usr = userFactory.getUser(); 

	$scope.back = function(){
		$location.path('/allCaterers'); 
	}

	$scope.update = function(){
		if($scope.displayname != ""){
			$http.post('/editdisplay', {userupdate: $scope.displayname, userid: usr._id}).success(function (response){
				if(response.sucess == "true"){
					console.log(JSON.parse(response.user));
					$window.alert("Display name Updated!"); 
				} else {					
					$window.alert(response.message);
				}
			});
		}else{
			$window.alert("Please enter a displayname.");	
		}
	}; 

	$scope.insert = function(){
		if($scope.cuisine != ""){
			$http.post('/editdishes', {userdish: $scope.cuisine, userid: usr._id}).success(function(response){
				if(response.sucess == "true"){
					console.log(JSON.parse(response.user)); 
					$window.alert(response.message); 
				}else{
					$window.alert(response.message); 
				}
			});
		}else{
			$window.alert("Please enter a cuisine.");	
		}
	};

	$scope.changePassword = function(){

		var checkWhitespace = function(s) {
  			return s.indexOf(' ') >= 0;
		}; 

		var oldpass = $scope.oldpassword; 
		var newpass = $scope.newpassword; 
		var conpass = $scope.conpassword; 

		if($scope.oldpassword == undefined){
			$window.alert("Please enter your current password"); 
		}else if($scope.newpassword == undefined){
			$window.alert("Please enter your new password"); 
		}else if($scope.conpassword == undefined){
			$window.alert("Please confirm your new password"); 
		}else if(checkWhitespace($scope.oldpassword) || checkWhitespace($scope.newpassword) || checkWhitespace($scope.conpassword)){
			$window.alert("Invalid password field(s). Please try again."); 
		}else if($scope.newpassword != $scope.conpassword){
			$window.alert("Passwords mismatch."); 
		}else{
			$http.post('/editpassword', {userpass: $scope.newpassword, userid: usr._id}).success(function(response){
				if(response.sucess == "true"){
					console.log(JSON.parse(response.user)); 
					$window.alert(response.message); 
				}else{
					$window.alert(response.message); 
				}
			});
		}
	};
});

app.controller('catererDisplay', function($scope, $http,  $location, $window, userFactory){
	var caterer = userFactory.getCaterer(); 
	var usr = userFactory.getUser(); 
	var i; 
	var str = "";
	var array_cus = caterer.catererProfile.speciality;
	var rev_array = caterer.catererProfile.reviews; 
	if(usr.type == 2){
		document.getElementById("revs").style.display = "none"; 
	}

	document.getElementById("display").innerHTML = caterer.displayname; 
	document.getElementById("email").innerHTML = caterer.username;
	document.getElementById("addr").innerHTML = caterer.catererProfile.address; 
	for(i = 0; i < array_cus.length; i++){
		if(i ==  array_cus.length - 1){
			str += " " + array_cus[i];
		}else{
			str += " " + array_cus[i] + ",";
		}
	}  
	document.getElementById("spec").innerHTML = str; 
	document.getElementById("desc").innerHTML = caterer.aboutMe;
	document.getElementById("pc").innerHTML = "$" + caterer.catererProfile.priceRangeLower + " to $" + caterer.catererProfile.priceRangeUpper; 
	var rev_str = ""; 
	for(i = 0; i < rev_array.length; i++){
		if(i ==  rev_array.length - 1){
			rev_str += " " + rev_array[i];
		}else{
			rev_str += " " + rev_array[i] + "<br>" + "<br>";
		}
	}  
	document.getElementById("r").innerHTML = caterer.catererProfile.avgrating; 
	document.getElementById("reviews").innerHTML = rev_str; 

	$scope.order = function(){
		userFactory.setCaterer(caterer);
		$location.path('/order');
	}

	$scope.back = function(){
		userFactory.setCaterer(null); 
		$location.path('/allCaterers'); 
	}

	$scope.postReview = function(){
		if($scope.catReview == undefined || $scope.rating == undefined){
			$window.alert("Missing field(s)."); 
		}else if($scope.rating > 5 || $scope.rating < 0 ){
			$window.alert("Invalid rating."); 
		}else{
			$http.post('/editReviews', {userRev: $scope.catReview + "<br>     " + "[by: " + usr.displayname + "]", userR: $scope.rating, catid: caterer._id}).success(function(response){
				if(response.sucess == "true"){
					console.log(JSON.parse(response.user)); 
					$window.alert(response.message); 
				}else{
					$window.alert(response.message); 
				}
			});
		}
	}
}); 


app.controller('orderController', function($scope, $http,  $location, $window, userFactory){
	
	$scope.back = function(){
		$location.path('/catererDisplay');
	}

	$scope.submit = function(){
		var cater = userFactory.getCaterer();
		var usr = userFactory.getUser();

		var order_details = $scope.details;
		var delivery_details = $scope.delivery_details;

		$http.post('/placeOrder', {user : usr._id, caterer : cater._id, order_det : order_details, delivery_det: delivery_details, client_name: usr.displayname}).success(function(response){
			$window.alert("Order Placed");
			$location.path('/catererDisplay');
		});

	};
});

app.controller('catererDashboard', function($scope, $http,  $location, $window, userFactory){
	var refresh = function(){
		$http.post('/getOrders', {status: 1, catererid: userFactory.getUser()._id}).success(function(response){
			console.log(response.orderList);
			$scope.newOrder = JSON.parse(response.orderList); 
		}); 

		$http.post('/getOrders', {status: 2, catererid: userFactory.getUser()._id}).success(function(response){
			console.log(response.orderList);
			$scope.pending = JSON.parse(response.orderList); 
		});

		$http.post('/getOrders', {status: 3, catererid: userFactory.getUser()._id}).success(function(response){
			console.log(response.orderList);
			$scope.completed = JSON.parse(response.orderList); 
		});
	}

	$scope.back = function(){
		$location.path('/allCaterers'); 
	}

	$scope.declineOrder = function(oid){
		$http.post('/updateOrderStatus', {orderid: oid, status: 0}).success(function(response) {
			refresh();
		});
	}

	$scope.acceptOrder = function(oid){
		$http.post('/updateOrderStatus', {orderid: oid, status: 2}).success(function(response) {
			refresh();
		});
	}

	$scope.completeOrder = function(oid){
		$http.post('/updateOrderStatus', {orderid: oid, status: 3}).success(function(response) {
			refresh();
		});	
	}

	refresh();
});

app.controller('catererEdit', function($scope, $http,  $location, $window, userFactory){
	var usr = userFactory.getUser(); 

	$scope.back = function(){
		$location.path('/allCaterers'); 
	}

	$scope.updateDisplay = function(){
		console.log($scope.displayname);
		if($scope.displayname != ""){
			$http.post('/editdisplay', {userupdate: $scope.displayname, userid: usr._id}).success(function (response){
				if(response.sucess == "true"){
					console.log(JSON.parse(response.user));
					$window.alert("Display name Updated!"); 
				} else {					
					$window.alert(response.message);
				}
			});
		}else{
			$window.alert("Please enter a displayname"); 
		}
	}; 
	
	$scope.updateBasic = function(){
		if($scope.userDesc!=""){
			console.log($scope.userDesc); 
			$http.post('/updateDesc', {userdesc: $scope.userDesc, userid: usr._id}).success(function (response){
				if(response.sucess == "true"){
					console.log(JSON.parse(response.user));
					$window.alert("Description name updated!"); 
				} else {					
					$window.alert(response.message);
				}
			});
		}else{
			$window.alert("Please enter the description"); 
		}
	}; 

	$scope.updatePrice = function(){
		if(($scope.from !="") && ($scope.to != "")){
			$http.post('/updatePriceRange', {userlow: $scope.from, userhigh: $scope.to,  userid: usr._id}).success(function (response){
				if(response.sucess == "true"){
					console.log(JSON.parse(response.user));
					$window.alert("Price updated!"); 
				} else {					
					$window.alert(response.message);
				}
			});
		}else{
			$window.alert("Please enter appropriate information."); 
		}
	}; 

	$scope.updateAddress = function(){
		if($scope.address!=""){
			$http.post('/updateAddr', {useraddr: $scope.address, userid: usr._id}).success(function(response){
				if(response.sucess == "true"){
					console.log(JSON.parse(response.user)); 
					$window.alert(response.message); 
				}else{
					$window.alert(response.message); 
				}
			});
		}else{
			$window.alert("Empty address field. Please enter an address and try again"); 
		}
	};


	$scope.addCuisine = function(){
		if($scope.cuisines!=""){
			$http.post('/editCus', {usercus: $scope.cuisines, userid: usr._id}).success(function(response){
				if(response.sucess == "true"){
					console.log(JSON.parse(response.user)); 
					$window.alert(response.message); 
				}else{
					$window.alert(response.message); 
				}
			});
		}else{
			$window.alert("No cuisine entered"); 
		}
	};

	$scope.updatePass = function(){

		var checkWhitespace = function(s) {
  			return s.indexOf(' ') >= 0;
		}; 

		var oldpass = $scope.oldpassword; 
		var newpass = $scope.newpassword; 
		var conpass = $scope.conpassword; 

		if($scope.oldpassword == undefined){
			$window.alert("Please enter your current password"); 
		}else if($scope.newpassword == undefined){
			$window.alert("Please enter your new password"); 
		}else if($scope.conpassword == undefined){
			$window.alert("Please confirm your new password"); 
		}else if(checkWhitespace($scope.oldpassword) || checkWhitespace($scope.newpassword) || checkWhitespace($scope.conpassword)){
			$window.alert("Invalid password field(s). Please try again."); 
		}else if($scope.newpassword != $scope.conpassword){
			$window.alert("Passwords mismatch."); 
		}else{
			$http.post('/editpassword', {userpass: $scope.newpassword, userid: usr._id}).success(function(response){
				if(response.sucess == "true"){
					console.log(JSON.parse(response.user)); 
					$window.alert(response.message); 
				}else{
					$window.alert(response.message); 
				}
			});
		}
	};
});

//Factory : stores the user currently logged in
app.factory('userFactory', function(){
	var userFactory = {};
	var user = null;
	var caterer = null; 

	userFactory.setCaterer = function(usr){
		caterer = usr; 
	};

	userFactory.getCaterer = function(usr){
		return caterer; 
	};

	userFactory.setUser = function(usr) {
		user = usr;
	};

	userFactory.getUser = function(usr) {
		return user;
	};

	return userFactory;
});
