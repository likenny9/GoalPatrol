var models = require('../models');

exports.html = function(req, res) {
	var name = req.session.name;
	var partial = req.session.partial;

	if(typeof name == 'undefined') {
		res.redirect('/login');
	}
	else {
		var users = {
			"name" : name
		};

		res.render('help', { "users" : users, 'partial' : partial });
	}
}

exports.newaccount = function(req, res) {
	var name = req.session.name;

	if(typeof name == 'undefined') {
		res.redirect('/login');
	}
	else {
		var users = {
			"name" : name
		};

		res.render('newhelp', { "users" : users, 'partial' : partial });
	}
}

exports.indexhelp = function(req, res) {
	res.render('indexhelp');
}