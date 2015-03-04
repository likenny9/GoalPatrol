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
			req.session.myid = loginResults[0]._id;
			req.session.profilepic = loginResults[0].profilepic;
			req.session.partial = Math.floor((Math.random() * 2) + 1);
			res.send();			
		}
	}
};

//Creates account in database
exports.create = function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var profilepic = "/images/silhouette-question-mark.jpg";

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
				req.session.myid = newUser._id;
				req.session.profilepic = profilepic;
				req.session.partial = Math.floor((Math.random() * 2) + 1);
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

//Checks that user does not already have that patrol
exports.checkAlreadyHaveGoal = function(req, res){
	var sessionUser = req.session.myid;
	var potentialPatrol = req.session.sendGoalToID;

	models.Patrol
		.find( { "myid" : sessionUser, "user" : potentialPatrol })
		.exec(afterSearch);

	function afterSearch(err, user) {
		if(err) {
			res.send({ error: 'Encountered an error searching for a user'});
		}
		else {
			if(user.length != 0) {
				res.send("FoundMatch");
			}
			else {
				res.send("Great");
			}
		}
	}

};

//Save a goal and patrol to database
exports.saveGoal = function(req, res){
	var goal = req.body.goal;
	var hoursweek = req.body.hours;
	var timesweek = req.body.times;
	var motivations = req.body.motivations;
	var sessionUser = req.session.userEmail;
	var sendGoalToID = req.session.sendGoalToID;
	var myid = req.session.myid;
	var pname = req.session.name;
	var profilepic = req.session.profilepic;

	var newPatrol = new models.Patrol({
		"pname" : pname,
		"pprofilepic" : profilepic,
		"goal" : goal,
		"hoursweek" : hoursweek,
		"timesweek" : timesweek,
		"motivations" : motivations,
		"goalwaiting" : "true",
		"user" : sendGoalToID,
		"myid" : myid
	});

	newPatrol.save(afterSetGoal);

	function afterSetGoal(err) {
		if(err) {
			res.send({ error: 'Encountered an error while saving the goal.'});
		}
		else {
			res.send();
		}
	}
};

//Deletes a goal and patrol when user clicks decline
exports.deleteGoal = function(req, res){
	var idToDelete = req.body.idToDelete;

	models.Patrol
		.find({ "_id" : idToDelete})
		.remove()
		.exec(afterDelete);

	function afterDelete(err) {
		if(err) {
			res.send({ error: 'Encountered an error while deleting the goal.'});
		}
		else {
			res.send();
		}
	}
};

//Just saves the goal ID to session
exports.saveGoalID = function(req, res){
	var idToSave = req.body.idToSave;
	req.session.goalID = idToSave;
	res.send();
};

//Gets the goal ID
exports.getGoalID = function(req, res) {
	res.send(req.session.goalID);
}

//Removes goal waiting
exports.removeGoalWaiting = function(req, res){
	var goalID = req.session.goalID;
	
	models.Patrol
		.find({ "_id" : goalID})
		.exec(updateFields);

	function updateFields(err, patrol) {
		if(err) {
			res.send({ error: 'Encountered an error while changing goalwaiting to false.'});
		}
		else {
			models.Patrol
				.find({ "_id" : goalID})
				.remove()
				.exec(afterDelete);

			function afterDelete(err) {
				if(err) {
					res.send({ error: 'Encountered an error while deleting the goal.'});
				}
			}

			var patrolModel = new models.Patrol({
				"_id" : patrol[0]._id,
				"pname" : patrol[0].pname,
				"pprofilepic" : patrol[0].profilepic,
				"goal" : patrol[0].goal,
				"hoursweek" : patrol[0].hoursweek,
				"timesweek" : patrol[0].timesweek,
				"motivations" : patrol[0].motivations,
				"goalwaiting" : "false",
				"user" : patrol[0].user,
				"myid" : patrol[0].myid
			});

			patrolModel.save(afterUpdating);

			function afterUpdating(err) {
				if(err) { res.send({ error: 'Encountered updating patrol information. '}); }
				else { res.send(); }
			}
		}
	}

};

//Updates Progress
exports.insertProgress = function(req, res){
	var goalID = req.session.goalID;
	
	models.Progress
		.find({ "patrol" : goalID})
		.exec(updateProgress);

	function updateProgress(err, progress) {
		//New Insert
		var newProgress = true;
		for(var i = 0; i < progress.length; i++) {
			if(progress[i].date.toDateString() == req.body.date) {
				newProgress = false;
				break;
			}
		}
		
		if(newProgress) {
			var progressModel = new models.Progress({
				"date" : req.body.date,
				"difficulty" : req.body.difficulty,
				"experience" : req.body.experience,
				"satisfaction" : req.body.satisfaction,
				"stress" : req.body.stress,
				"comments" : req.body.comments,
				"patrol" : goalID
			});

			progressModel.save(afterCreateProgress);

			function afterCreateProgress(err) {
				if(err) { res.send({ error: 'Encountered error entering progress information. '}); }
				else { res.send(req.body.patrol); }
			}
		}
		//Update
		else {
			models.Progress
				.find({ "patrol" : goalID, "date" : req.body.date })
				.remove()
				.exec(afterDelete);

			function afterDelete(err) {
				if(err) {
					res.send({ error: 'Encountered an error while deleting progress.'});
				}
			}

			var progressModel = new models.Progress({
				"date" : req.body.date,
				"difficulty" : req.body.difficulty,
				"experience" : req.body.experience,
				"satisfaction" : req.body.satisfaction,
				"stress" : req.body.stress,
				"comments" : req.body.comments,
				"patrol" : goalID
			});

			progressModel.save(afterUpdating);

			function afterUpdating(err) {
				if(err) { res.send({ error: 'Encountered error updating progress information. '}); }
				else { res.send(req.body.patrol); }
			}
		}
	}
};

//Updates Progress
exports.logout = function(req, res){
	req.session.destroy();
	res.send();
};
