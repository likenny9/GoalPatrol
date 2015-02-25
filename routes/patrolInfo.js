var models = require('../models');

exports.yourGoalForPatrol = function(req, res){
	var sessionUser = req.session.userEmail;
	
	if(typeof sessionUser == 'undefined') {
		res.redirect('/login');
	}
	else {
		var userID = req.params.id;
		var myID = req.params.myid;

		models.User
			.find( { "_id" : myID})
			.exec(goalForThisPerson);
		function goalForThisPerson(err, goalUserInfo) {
			models.User
				.find( { "email" : sessionUser })
				.exec(renderGoals);
			function renderGoals(err, users) {
				models.Patrol
					.find( { "myid" : userID, "user" : myID })
					.exec(afterFind);

				function afterFind(err, patrols) {
					res.render('patrolInfo', {'users': users, 'patrols' : patrols, 'goalUserInfo' : goalUserInfo });
				}
			}
		}
	}
};