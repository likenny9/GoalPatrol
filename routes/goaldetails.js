exports.html = function(req, res) {

	var sessionUser = req.session.userEmail;
	var partial = req.session.partial;

	if(typeof sessionUser == 'undefined') {
		res.redirect('/login');
	}

	else {
		var users = {
			"name" : req.session.name
		};

		users = [users];

		res.render('goaldetails', { 'users' : users, 'partial' : partial });
	}	
};