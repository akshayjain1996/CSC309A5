var controller = require('../controllers/controller');

module.exports = function(app) {

	app.get('/', function (req, res) {
		console.log("index")
		res.sendfile("./views/index.html");
	});

	app.post('/signup', controller.addUser);


/*
	app.post('/login', controller.login);

	app.get('/userlist', controller.allUsers);

	app.post('/editProfile', controller.editProfile);

	app.post('/updatePassword', controller.updatePassword);

	app.post('/makeAdmin', controller.makeAdmin);

	app.post('/deleteUser', controller.deleteUser);

	app.post('/removeAdmin', controller.removeAdmin);

	app.post('/tracker', controller.pageCount);

	app.post('/logout', controller.logout);

	app.post('/uploadPic', controller.uploadPic);
	*/
};