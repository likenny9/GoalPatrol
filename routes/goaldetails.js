exports.html = function(req, res) {

	var sessionUser = req.session.userEmail;

	if(typeof sessionUser == 'undefined') {
		res.redirect('/login');
	}

	else {
		var users = {
			"name" : req.session.name
		};

		users = [users];

		res.render('goaldetails', { 'users' : users });
	}	
};