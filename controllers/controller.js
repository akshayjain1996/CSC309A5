var User = require('../models/Account');
var Order = require('../models/Order');

module.exports = {
	
	addUser : function(req, res){
		User.findOne( {username : req.body.username}, function(err, docs) {
			if(err) {
				console.log('user already exists');
				res.send({sucess: 'false', message: 'User already exists!'});
			} else if(docs){
				console.log('user already exists');
				res.send({sucess: 'false', message: 'User already exists!'});
			}else {
				var session;
				session = req.session;
				var usr = new User();				
				usr.displayname = req.body.displayname;
				usr.username = req.body.username;
				usr.password = req.body.password;
				usr.description = req.body.description;
				usr.alluserPage = 0;
				usr.profilePage = 0;
				usr.editPage = 0;
				usr.trackPage = 0;
				usr.save();
				session.username = usr.username;

				User.count({}, function(err, count) {
					console.log(count);
					if(count == 1){
						console.log("New Super User made");
						usr.permission = 0;
						usr.save();
					} else {
						console.log("New User made");
						usr.permission = 2;
						usr.save();
					}
					res.session = session;
					res.send({sucess: 'true', user: JSON.stringify(usr)});
				});


			}
		});

	},

	allUsers : function(req, res){
		console.log("In allusers")
		var session;
		session = req.session;
		User.find({}, function (err, docs) {
			if(err){
				console.log(error);
			} else{
				console.log("Sending resp");
				console.log(docs);
				res.session = session;
				res.send({userList: docs});
    		}
    	});
	},

	editProfile : function(req, res){
		var session;
		var session = req.session;
		var targetUser = JSON.parse(req.body.user);
		if(targetUser == null){
			console.log("Target user is null");
		}
		if((session.username == targetUser.username) || (session.permission < 2)){
			User.findOne( {username : targetUser.username}, function(err, usr) {
				if(!usr) {
					console.log("No such user exists!");
				}
				usr.description = targetUser.description;
				usr.displayname = targetUser.displayname;
				usr.save();
				console.log("Update Sucessful");
			} );
			res.session = session;
			res.send({message: "success"});
		}  else {
			console.log("Invalid permission");
			res.session = session;
			res.send({message: "Invalid Permissions"});
		}
	},

	updatePassword : function(req, res){
		var session;
		var session = req.session;
		var targetUser = JSON.parse(req.body.user);
		if(targetUser == null){
			console.log("Target user is null");
		}
		User.findOne( {username : targetUser.username}, function(err, usr) {
			if(!usr) {
				res.session = session;
				res.send({message: "No such User Exists"});
				console.log("No such user exists!");
			} else {
				usr.password = targetUser.password;
				usr.save();
				res.session = session;
				res.send({message: "success"});
				console.log("Update Sucessful");
			}
		} );	
	},

	makeAdmin : function(req, res){
		var session;
		session = req.session;
		var targetUser = JSON.parse(req.body.user);
		User.findOne( {username : targetUser.username}, function(err, usr) {
			if(err){
				console.log(err);
			}
			if(!usr) {
				console.log('No user Exists');
				res.session = session;
				res.send({message: 'No such user'});
			} else {
				usr.permission = 1;	
				usr.save();
				res.session = session;
				res.send({message: 'success'});
				console.log("Update Sucessful");
			}
			
		});
	},

	removeAdmin : function(req, res){
		var session;
		session = req.session;
		var targetUser = JSON.parse(req.body.user);
		User.findOne( {username : targetUser.username}, function(err, usr) {
			if(err){
				console.log(err);
			}
			if(!usr) {
				console.log('No user Exists');
				res.session = session;
				res.send({message: 'No such user'});
			} else {
				usr.permission = 2;	
				usr.save();
				res.session = session;
				res.send({message: 'success'});
				console.log("Update Sucessful");
			}
			
		});
	},

	deleteUser : function(req, res){
		var session;
		session = req.session;
		var targetUser = JSON.parse(req.body.user);
		User.remove( {username : targetUser.username}, function(err) {
			if(err){
				console.log(err);
			} else {
				console.log('success');
				res.session = session;
				res.send({message: 'Success'});
			}
		});
	},

	logout : function(req, res){
		var session;
		session = req.session;
		res.session = null;
		res.send({message: 'Logged out'});

	},

	ipList : function(req, res){
		var session;
		session = req.session;
		User.findOne( {username : req.body.username}, function(err, usr) {
			if(err){
				console.log(err);
				res.send({sucess: 'false', message: 'No such user'});
			} else if(!usr) {
				console.log('No user Exists');
				res.send({message: 'No such user'});
			} else {
				console.log(usr.ip);
			}
		} );
	},

	pageCount : function(req, res){
		var session;
		session = req.session;
		console.log("Inside track");
		console.log(req.body.page);
		User.findOne( {username: session.username}, function(err, usr) {
			if(err){
				console.log(err);
			}else if(!usr){
				console.log("Invalid Session");
			} else {
				var page = req.body.page;
				if(page == "allusers"){
					usr.alluserPage = usr.alluserPage + 1;
				} else if(page == "edituser") {
					usr.editPage = usr.editPage + 1;
				} else if(page == "profile"){
					usr.profilePage = usr.profilePage + 1;
				} else if(page == "track"){
					usr.trackPage = usr.trackPage + 1;
				} else {
					console.log ("Invalid page");
				}
				usr.save();
			}
		});
		res.session =session;
		res.send({message: 'success'});
	},

	uploadPic : function(req, res){
		var session;
		session = req.session;

		res.session =session;
		res.send({message: 'success'});
	},

	login : function(req, res){
		var session;
		session = req.session;
		User.findOne( {username : req.body.username}, function(err, usr) {
			if(err){
				console.log(err);
				res.send({sucess: 'false', message: 'No such user'});
			}
			if(!usr) {
				console.log('No user Exists');
				res.send({sucess: 'false', message: 'No such user'});
			}else if(usr.password == req.body.password){
				console.log(req.connection.remoteAddress);

				var ipList = usr.ip;
				if(ipList.indexOf(req.connection.remoteAddress) < 0){
					console.log(req.connection.remoteAddress);
					usr.ip.push(req.connection.remoteAddress);
				}
				usr.save();

				session.username = usr.username;
				session.permission = usr.permission;
				res.session = session;
				res.send({sucess: 'true', user: JSON.stringify(usr)});
			}
		});

	},
	/*
	Order functions below
	*/
	
	addOrder : function(req, res){
		var session;
		session = req.session;
		var order = new Order();				
		order.details = req.body.details;
		order.contact_info = req.body.contact_info;
		//order.placed_time
		order.fulfillment_time = req.body.fulfillment_time;
		order.delivery_details = req.body.delivery_details;
		order.catererid = req.body.catererid;// -1 = not assigned to specific caterer
		order.status = 0;//0=not accepted yet, 1=acccepted, 2=done
		order.save();
		res.session = session;
		res.send({sucess: 'true', user: JSON.stringify(order)});
	},
	
	updateOrderStatus: function(req, res){
		Order.findOne( {id : req.body.orderid}, function(err, order) {
				if(!order) {
					console.log("No such order exists!");
				}
				order.status = req.body.orderstatus;
				order.catererid = req.body.catererid;
				order.save();
				console.log("Update Sucessful");
			} );
	},	
	
	// filtered by req.body.catererid & req.body.status
	// catererid -1 means not assigned to anyone
	getOrders: function(req, res){
		Order.find({status: req.body.status, catererid: req.body.catererid}, function (err, docs) {
			if(err){
				console.log(error);
			} else{
				console.log("Sending resp");
				console.log(docs);
				res.session = session;
				res.send({orderList: docs});
    		}
    	});
	}
	//
}