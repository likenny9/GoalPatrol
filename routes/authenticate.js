var models = require('../models');

exports.login = function(req, res){
	var email = req.body.email;
	var password = req.body.password;


	models.User
		.find( { "email" : email, "password" : password })
		.exec(renderLogin);

	function renderLogin(err, loginResults) {
		console.log(loginResults);
		console.log(loginResults.length);
		if(loginResults.length == 0) {
			res.send({ error: 'Incorrect email or password.'});
		} 
		else {
			req.session.userEmail = req.body.email;
			res.send();			
		}
	}
};

exports.create = function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var profilepic = "";

	models.User
		.find( { "email" : email })
		.exec(emailSearch);

	function emailSearch(err, searchResults) {
		if(searchResults.length == 0) {
			insertUser();
		}
		else {
			res.send({ error: 'This email is already registered. '});
		}
	}

	function insertUser() {
		var newUser = new models.User({
			"name" : name,
			"email" : email,
			"password" : password,
			"profilepic" : profilepic
		});

		newUser.save(afterCreateUser);

		function afterCreateUser(err) {
			if(err) {
				res.send({ error: 'Encountered an error during creation'});
			}
			else {
				req.session.userEmail = email;
				res.send();
			}
		}
	}

};