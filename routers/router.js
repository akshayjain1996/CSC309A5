var controller = require('../controllers/controller');

function auth(req, res) {
  if(req.session.authenticated != 1){
	res.statusCode = 403; 
	res.writeHead(403);
	res.end("Forbidden.");
	return false;	
  }
  else{
	  //console.log("Here");
	  //res.sendfile("./views/index.html");
	  return true;
  }
}

module.exports = function(app) {
	
	app.get('/', function (req, res) { 

		console.log("index");
		res.sendfile("./views/index.html");
	});
	
	app.get('/*', function (req, res, next) {
		var cont = auth(req, res);
		if(cont == true){
			next();
		}
	});

	app.post('/signup', controller.addUser);
	
	app.post('/loggedincheck', controller.loggedincheck);
	
	app.get('/signup', function (req, res) {
		console.log("index");
		res.sendfile("./views/index.html");
	});

	app.get('/reqcaterers', controller.allCaterers);
	
	app.get('/caterers', function (req, res) {
		console.log("index");
		res.sendfile("./views/index.html");
	});
	
	app.post('/login', controller.login);

	app.post('/makeCaterer', controller.makeCaterer);

	app.post('/getOrders', controller.getOrders);

	app.post('/editdisplay', controller.editDisplay); 

	app.post('/editdishes', controller.editDishes); 

	app.post('/editpassword', controller.editPass);

	app.post('/updateDesc', controller.editDesc);

	app.post('/updatePriceRange', controller.editPrice); 

	app.post('/updateAddr', controller.editAddr); 

	app.post('/editCus', controller.editCus); 

	app.post('/placeOrder', controller.addOrder);

	app.post('/updateOrderStatus', controller.updateOrderStatus);
	
	app.post('/editReviews', controller.editRev); 

	app.post('/logout', controller.logout);
	
	app.get('/*', function (req, res, next) {
		res.sendfile("./views/index.html");
	});
/*
	app.get('/userlist', controller.allUsers);

	app.post('/editProfile', controller.editProfile);

	app.post('/updatePassword', controller.updatePassword);

	app.post('/makeAdmin', controller.makeAdmin);

	app.post('/deleteUser', controller.deleteUser);

	app.post('/removeAdmin', controller.removeAdmin);

	app.post('/tracker', controller.pageCount);

	

	app.post('/uploadPic', controller.uploadPic);
	*/
};
