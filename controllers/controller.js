var Account = require('../models/Account');
var Order = require('../models/Order');
var UserProfile = require('../models/UserProfile');

module.exports = {
	
	addUser : function(req, res){
		Account.findOne( {username : req.body.username}, function(err, docs) {
			if(err) {
				console.log('user already exists');
				res.send({sucess: 'false', message: 'User already exists!'});
			} else if(docs){
				console.log('user already exists');
				res.send({sucess: 'false', message: 'User already exists!'});
			}else {
				console.log("reached");
				var session;
				session = req.session;
			
				var account = new User();
				var account = new Account();

				var userProfile = new UserProfile();
				account.userProfile = userProfile;

				account.displayname = req.body.displayname;
				account.username = req.body.username;
				account.password = req.body.password;

				account.save();
				session.username = account.username;

				res.session = session;
				res.send({sucess: 'true', user: JSON.stringify(account)});
				
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

	logout : function(req, res){
		var session;
		session = req.session;
		res.session = null;
		res.send({message: 'Logged out'});

	},

	login : function(req, res){
		var session;
		session = req.session;
		console.log( req.body.username);
		Account.findOne( {username : req.body.username}, function(err, account) {
			if(err){
				console.log(err);
				res.send({sucess: 'false', message: 'No such user'});
			}
			if(!account) {
				console.log('No user Exists');
				res.send({sucess: 'false', message: 'No such user'});
			} else if (account.password == req.body.password){

				session.username = account.username;
				res.session = session;
				res.send({sucess: 'true', user: JSON.stringify(account)});

			}
		});

	},

	allCaterers : function(req, res){
		Account.find({}, function(err, accounts){
			var catererList = [];
			for(var i = 0; i < accounts.length; i++){
				if(accounts[i].catererProfile != null){
					catererList.add(accounts[i]);
				}
			}

			res.send({caterers : JSON.stringify(catererList)});
		});
	},
	
	uploadProfile: function  (req, res) {
		if(req.method === 'GET')
			return res.json({'status':'GET not allowed'});

		var uploadFile = req.file('uploadFile');

	    uploadFile.upload({ dirname: '/public/img/profile'},function onUploadComplete (err, files) {
	    																		
	    	if (err) return res.serverError(err);
			var fullName = files[0].fd;
			var arr = fullName.split("\\");
			User.update({id: req.body.catererid}, {profile_img_link: (arr[arr.length - 1])}).exec(function cb(err){
				});
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
	},
	
	//when an order is rejected add it to the pool of orders that have not been picked up by anybody
	rejectOrder: function(req, res){
		req.body.orderstatus = 0;
		req.body.catererid = -1;
		updateOrderStatus(req, res);
	}
}