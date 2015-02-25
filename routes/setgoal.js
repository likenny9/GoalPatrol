var models = require('../models');

exports.html = function(req, res){
	var sessionUser = req.session.userEmail;
	var sessionName = req.session.name;
	var personToSendGoalTo = req.session.sendGoalToID;

	if(typeof sessionUser == 'undefined') {
		res.redirect('/login');
	}
	else if(typeof personToSendGoalTo == 'undefined') {
		res.redirect('/sendgoal');
	}
	else {
		models.User
			.find( { "_id" : personToSendGoalTo })
			.exec(renderSetGoal);
		function renderSetGoal(err, users) {
  			res.render('setgoal', { "users" : { "name" : sessionName}, "goalToUser" : users});
		}
  	}
};