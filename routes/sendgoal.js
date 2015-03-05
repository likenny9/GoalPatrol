var models = require('../models');

exports.html = function(req, res){
	var sessionUser = req.session.userEmail;
	var partial = req.session.partial;

	if(typeof sessionUser == 'undefined') {
		res.redirect('/login');
	}
	else {
		models.User
			.find( { "email" : sessionUser })
			.exec(renderSendGoal);
		function renderSendGoal(err, users) {
  			res.render('sendgoal', { "users" : users, 'partial' : partial });
		}
  	}
};
