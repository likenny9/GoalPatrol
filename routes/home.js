var models = require('../models');

//Render Home HTML Page
exports.html = function(req, res){
	var sessionUser = req.session.userEmail;
	var partial = req.session.partial;

	if(typeof sessionUser == 'undefined') {
		res.redirect('/login');
	}
	//console.log("Logged in as " + sessionUser);
	else {
		models.User
			.find( { "email" : sessionUser })
			.exec(renderGoals);

		function renderGoals(err, users) {
			models.Patrol
				.find( { "user" : users[0]._id })
				.exec(renderPatrols);
				
			function renderPatrols(err, patrols) {
				res.render('home', {'users': users, 'patrols' : patrols, 'partial' : partial });
			}
		}
	}

};

