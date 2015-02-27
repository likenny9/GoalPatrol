var models = require('../models');

exports.html = function(req, res) {
	var name = req.session.name;

	if(typeof name == 'undefined') {
		res.redirect('/login');
	}
	else {
		var users = {
			"name" : name
		};

		res.render('help', { "users" : users });
	}
}