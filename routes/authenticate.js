var models = require('../models');

//Searches for account in database, log in
exports.login = function(req, res){
	var email = req.body.email;
	var password = req.body.password;


	models.User
		.find( { "email" : email, "password" : password })
		.exec(renderLogin);

	function renderLogin(err, loginResults) {
		if(loginResults.length == 0) {
			res.send({ error: 'Incorrect email or password.'});
		} 
		else {
			req.session.userEmail = req.body.email;
			req.session.name = loginResults[0].name;
			res.send();			
		}
	}
};

//Creates account in database
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
				req.session.name = name;
				res.send();
			}
		}
	}

};

//Search for a user in the database
exports.getUsers = function(req, res){
	var email = req.body.email;
	var sessionUser = req.session.userEmail;

	if(email == sessionUser) {
		res.send({ error: 'You cannot send a goal to yourself.'});
	}
	else {
		models.User
			.find( { "email" : email })
			.exec(afterSearch);

		function afterSearch(err, user) {
			if(err) {
				res.send({ error: 'Encountered an error searching for a user'});
			}
			else {
				if(user.length == 0) {
					res.send("NotFound");
				}
				else {
					req.session.sendGoalToID = user[0]._id;
					res.send(user[0]);
				}
			}
		}
	}


};