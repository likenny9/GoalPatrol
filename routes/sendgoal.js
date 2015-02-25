var models = require('../models');

exports.html = function(req, res){
	var sessionUser = req.session.userEmail;

	if(typeof sessionUser == 'undefined') {
		res.redirect('/login');
	}
	else {
		models.User
			.find( { "email" : sessionUser })
			.exec(renderSendGoal);
		function renderSendGoal(err, users) {
  			res.render('sendgoal', { "users" : users });
		}
  	}
};
